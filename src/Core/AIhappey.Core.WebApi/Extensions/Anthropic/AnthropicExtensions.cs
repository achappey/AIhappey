using AIhappey.Core.WebApi.Models;
using Anthropic.SDK.Messaging;
using ANT = Anthropic.SDK;

namespace AIhappey.Core.WebApi.Extensions.Anthropic;

public static class AnthropicExtensions
{
    private static readonly Dictionary<string, (string callId, string name, string args)> _toolCallArgs = new();

    public static Message ToMessage(this ModelContextProtocol.Protocol.SamplingMessage samplingMessage)
    {
        List<ANT.Messaging.ContentBase> contents = [];

        contents.Add(new ANT.Messaging.TextContent()
        {
            Text = samplingMessage.Content.Text
        });

        return new ANT.Messaging.Message()
        {
            Role = samplingMessage.Role == ModelContextProtocol.Protocol.Role.User ? RoleType.User : RoleType.Assistant,
            Content = contents
        };
    }

    public static IEnumerable<ANT.Messaging.Message> ToMessages(this IReadOnlyList<ModelContextProtocol.Protocol.SamplingMessage> samplingMessages)
        => samplingMessages.Select(a => a.ToMessage());

    public static MessageParameters ToMessageParameters(this IEnumerable<Message> messages,
        string model, IEnumerable<ANT.Common.Tool>? tools)
    {
        var hasLargeContext = model.StartsWith("claude-3-7")
               || model.StartsWith("claude-opus-4")
               || model.StartsWith("claude-sonnet-4");

        return new()
        {
            Messages = [.. messages],
            Tools = tools?.ToList() ?? [],
            MaxTokens = hasLargeContext ? 20000 : 4096,
            Model = model,
        /*    Thinking = hasLargeContext ?new ThinkingParameters()
            {
                BudgetTokens = 16000
            } : null*/
        };
    }


    public static UIMessagePart? ToStreamingResponseUpdate(this MessageResponse update)
    {
        //if update is Anthropic.SDK.Messaging.StreamMessage.StreamingResponseOutputItemAddedUpdate
        if (!string.IsNullOrEmpty(update.Delta?.Text))
        {
            return new TextUIPart
            {
                Text = update.Delta.Text
            };
        }

        if (!string.IsNullOrEmpty(update.Delta?.Thinking))
        {
            return new ReasoningUIPart
            {
                Text = update.Delta.Text
            };
        }

        return null;
    }


    public static IEnumerable<ANT.Messaging.Message> ToMessages(this UIMessage message)
    {
        List<ANT.Messaging.ContentBase> contents = [];
        foreach (var part in message.Parts.OfType<TextUIPart>())
        {
            contents.Add(new ANT.Messaging.TextContent()
            {
                Text = part.Text
            });
        }

        var newMessage = new ANT.Messaging.Message()
        {
            Role = message.Role == Role.user ? ANT.Messaging.RoleType.User : ANT.Messaging.RoleType.Assistant,
            Content = contents
        };

        switch (message.Role)
        {

            //----------------------------------------------------------------------
            // USER → exactly one response item
            //----------------------------------------------------------------------
            case Role.user:
                yield return newMessage;
                yield break;

            //----------------------------------------------------------------------
            // ASSISTANT
            //----------------------------------------------------------------------
            case Role.assistant:
                // (1) Free-form assistant text, if any
                var textParts = message.Parts.OfType<TextUIPart>().ToList();
                if (textParts.Count > 0)
                {
                    yield return newMessage;
                }

                // (2) Each tool invocation becomes *two* items
                /*    foreach (var tip in message.Parts.OfType<ToolInvocationPart>())
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
                    }*/
                yield break;

            //----------------------------------------------------------------------
            // Anything else → error
            //----------------------------------------------------------------------
            default:
                throw new NotSupportedException(
                    $"Unsupported UIMessage role: {message.Role}");
        }
    }


    /* public static IEnumerable<ResponseContentPart> ToAssistantMessageResponseContentParts(this List<UIMessagePart> parts)
     {

         foreach (var part in parts)
         {

             switch (part)
             {
                 case TextUIPart text:
                     yield return ResponseContentPart.CreateOutputTextPart(text.Text, []);
                     break;
                 case ToolInvocationPart text:
                 text.ToolInvocation.ToolCallId
                 text.ToolInvocation.ToolName
                 text.ToolInvocation.Args
                 text.ToolInvocation.Result
                   //  yield return ResponseContentPart.CreateOutputTextPart(text.Text, []);
                     break;
                 default:
                     throw new NotSupportedException($"Unsupported UIPart type: {part.GetType().Name}");
             }
         }


     }

     public static ResponseItem ToResponseItem(this UIMessage message)
     {
         ResponseItem.CreateFunctionCallItem()
         ResponseItem.CreateFunctionCallOutputItem()
         return message.Role switch
         {
             Role.user => ResponseItem.CreateUserMessageItem(message.Parts.ToUserMessageResponseContentParts()),
             Role.assistant => ResponseItem.CreateAssistantMessageItem(message.Parts.ToAssistantMessageResponseContentParts()),
             _ => throw new NotSupportedException($"Unsupported UIMessage role: {message.Role}"),
         };
     }*/
}