using OpenAI.Responses;
using AIhappey.Core.WebApi.Models;
using System.Text.Json;
using OpenAI.Chat;

namespace AIhappey.Core.WebApi.Extensions.OpenAI;

public static class OpenAIExtensions
{
    private static readonly Dictionary<string, (string callId, string name, string args)> _toolCallArgs = new();

    public static UIMessagePart? ToStreamingResponseUpdate(this StreamingResponseUpdate update)
    {
        if (update is StreamingResponseOutputTextDeltaUpdate deltaUpdate)
        {
            return new TextUIPart
            {
                Text = deltaUpdate.Delta
            };
        }

        if (update is StreamingResponseTextAnnotationAddedUpdate streamingResponseTextAnnotationAddedUpdate)
        {
            return new SourceUIPart
            {
                Source = new()
                {
                    Url = streamingResponseTextAnnotationAddedUpdate.Annotation.UriCitationUri,
                    Title = streamingResponseTextAnnotationAddedUpdate.Annotation.UriCitationTitle,
                }
            };
        }

        if (update is StreamingResponseOutputItemAddedUpdate streamingResponseOutputItemAddedUpdate)
        {
            if (streamingResponseOutputItemAddedUpdate.Item is FunctionCallResponseItem functionCallResponseItem)
            {

                if (!_toolCallArgs.ContainsKey(functionCallResponseItem.Id))
                    _toolCallArgs[functionCallResponseItem.Id] =
                        (callId: functionCallResponseItem.CallId,
                        name: functionCallResponseItem.FunctionName,
                        args: "");

            }
        }

        // Accumulate tool call args deltas
        if (update is StreamingResponseFunctionCallArgumentsDeltaUpdate argsDeltaUpdate)
        {

            if (_toolCallArgs.ContainsKey(argsDeltaUpdate.ItemId))
            {
                var entry = _toolCallArgs[argsDeltaUpdate.ItemId];
                entry.args += argsDeltaUpdate.Delta;
                _toolCallArgs[argsDeltaUpdate.ItemId] = entry;
            }

            return null; // Don't emit yet
        }

        // Emit part when done, with concatenated arguments
        if (update is StreamingResponseFunctionCallArgumentsDoneUpdate argsDoneUpdate)
        {
            string args;
            string callId = null!;
            string toolName = null!;
            if (_toolCallArgs.TryGetValue(argsDoneUpdate.ItemId, out var tuple))
            {
                args = tuple.args;
                callId = tuple.callId;
                toolName = tuple.name;
                _toolCallArgs.Remove(argsDoneUpdate.ItemId);
            }
            else
            {
                // Fallback if no deltas were accumulated
                args = argsDoneUpdate.Arguments?.ToString() ?? "";
            }

            return new ToolCallPart
            {
                ToolCallId = callId,
                ToolName = toolName,
                Args = args // Prefer accumulated if present
            };
        }


        return null;
    }

    public static IEnumerable<ResponseContentPart> ToUserMessageResponseContentParts(this List<UIMessagePart> parts)
    {

        foreach (var part in parts)
        {

            switch (part)
            {
                case TextUIPart text:
                    yield return ResponseContentPart.CreateInputTextPart(text.Text);
                    break;
                default:
                    throw new NotSupportedException($"Unsupported UIPart type: {part.GetType().Name}");
            }
        }
    }

    // 1.  Helper: convert only the TEXT assistant parts --------------------------
    private static IEnumerable<ResponseContentPart> ToAssistantTextContentParts(
        this IEnumerable<TextUIPart> textParts)
    {
        foreach (var t in textParts)
            yield return ResponseContentPart.CreateOutputTextPart(t.Text, []);
    }

    public static ResponseItem ToResponseItem(this ModelContextProtocol.Protocol.SamplingMessage samplingMessage)
        => samplingMessage.Role == ModelContextProtocol.Protocol.Role.User ?
            ResponseItem.CreateUserMessageItem(samplingMessage.Content.Text)
            : ResponseItem.CreateAssistantMessageItem(samplingMessage.Content.Text);

    public static ChatMessage ToChatMessage(this ModelContextProtocol.Protocol.SamplingMessage samplingMessage)
            => samplingMessage.Role == ModelContextProtocol.Protocol.Role.User ?
                ChatMessage.CreateUserMessage(samplingMessage.Content.Text)
                : ChatMessage.CreateAssistantMessage(samplingMessage.Content.Text);

    public static IEnumerable<ResponseItem> ToResponseItems(this IReadOnlyList<ModelContextProtocol.Protocol.SamplingMessage> samplingMessages)
        => samplingMessages.Select(a => a.ToResponseItem());

    public static IEnumerable<ChatMessage> ToChatMessages(this IReadOnlyList<ModelContextProtocol.Protocol.SamplingMessage> samplingMessages)
        => samplingMessages.Select(a => a.ToChatMessage());


    // 2.  New top-level extension -------------------------------------------------
    /// <summary>
    /// Converts a <see cref="UIMessage"/> into one-or-more <see cref="ResponseItem"/>s.
    /// • user  → 1 item (same as before)  
    /// • assistant/text-only → 1 item (same as before)  
    /// • assistant/with tool invocation →
    ///     a)  0 – 1 text item (if there is free text)  
    ///     b)  1 function-call item  
    ///     c)  1 function-call-output item
    /// </summary>
    public static IEnumerable<ResponseItem> ToResponseItems(this UIMessage message)
    {
        switch (message.Role)
        {
            //----------------------------------------------------------------------
            // USER → exactly one response item
            //----------------------------------------------------------------------
            case Role.user:
                yield return ResponseItem.CreateUserMessageItem(
                    message.Parts.ToUserMessageResponseContentParts());
                yield break;

            //----------------------------------------------------------------------
            // ASSISTANT
            //----------------------------------------------------------------------
            case Role.assistant:
                // (1) Free-form assistant text, if any
                var textParts = message.Parts.OfType<TextUIPart>().ToList();
                if (textParts.Count > 0)
                {
                    yield return ResponseItem.CreateAssistantMessageItem(
                        textParts.ToAssistantTextContentParts().ToList());
                }

                // (2) Each tool invocation becomes *two* items
                foreach (var tip in message.Parts.OfType<ToolInvocationPart>())
                {
                    // 2a – the function-call "shell"
                    yield return ResponseItem.CreateFunctionCallItem(
                        tip.ToolInvocation.ToolCallId,
                        tip.ToolInvocation.ToolName,
                       BinaryData.FromString(tip.ToolInvocation.Args));

                    // 2b – the tool’s answer
                    yield return ResponseItem.CreateFunctionCallOutputItem(
                        tip.ToolInvocation.ToolCallId,
                        JsonSerializer.Serialize(tip.ToolInvocation.Result, JsonSerializerOptions.Web));
                }
                yield break;

            //----------------------------------------------------------------------
            // Anything else → error
            //----------------------------------------------------------------------
            default:
                throw new NotSupportedException(
                    $"Unsupported UIMessage role: {message.Role}");
        }
    }
}