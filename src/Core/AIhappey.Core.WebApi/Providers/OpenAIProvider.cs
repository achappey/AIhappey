using Microsoft.Extensions.Options;
using AIhappey.Core.WebApi.AI;
using OpenAI.Responses;
using AIhappey.Core.WebApi.Models;
using AIhappey.Core.WebApi.Extensions.OpenAI;
using OpenAI.Models;
using ModelContextProtocol.Protocol;
using OpenAI;
using OpenAI.Chat;

namespace AIhappey.Core.WebApi.Providers;

public class OpenAIProvider(IOptions<AIServiceConfig> config) : IModelProvider
{
    private readonly ProviderConfig _config = config.Value.OpenAI!;

    public bool CanHandleModel(string model) =>
        !string.IsNullOrWhiteSpace(model) && (model.StartsWith("gpt-", StringComparison.OrdinalIgnoreCase)
            || model.StartsWith("o1", StringComparison.OrdinalIgnoreCase)
            || model.StartsWith("o3", StringComparison.OrdinalIgnoreCase)
            || model.StartsWith("o4", StringComparison.OrdinalIgnoreCase)
            || model.StartsWith("codex-", StringComparison.OrdinalIgnoreCase));

    private static ResponseCreationOptions ToResponseCreationOptions(string model) => new()
    {
        TruncationMode = ResponseTruncationMode.Auto,
        ReasoningOptions = model.StartsWith("o") ? new ResponseReasoningOptions()
        {
            ReasoningEffortLevel = ResponseReasoningEffortLevel.High,
          //  ReasoningSummaryVerbosity = ResponseReasoningSummaryVerbosity.Detailed,
        } : null
    };

    private static ChatCompletionOptions ToChatCompletionOptions(string model)
    {
        ChatCompletionOptions options = new();

        if (model.StartsWith("o"))
        {
            options.ReasoningEffortLevel = ChatReasoningEffortLevel.High;
        }

        return options;
    }

    public async Task<UIMessagePart> CompleteAsync(ChatRequest chatRequest, CancellationToken cancellationToken = default)
    {
        var responseClient = new OpenAIResponseClient(
            chatRequest.Model ?? _config.ModelId,
            _config.ApiKey
        );

        IEnumerable<ResponseItem> inputItems = chatRequest.Messages.SelectMany(a => a.ToResponseItems());

        var clientResult = await responseClient.CreateResponseAsync(inputItems, ToResponseCreationOptions(chatRequest.Model!), cancellationToken);
        var result = clientResult.Value;

        return new TextUIPart
        {
            Text = clientResult.Value.GetOutputText()
        };
    }

    public async Task<CreateMessageResult> SamplingAsync(CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default)
    {
        var model = chatRequest.ModelPreferences?.Hints?.FirstOrDefault()?.Name;
        if (model?.Contains("search-preview") == true)
        {
            return await ChatCompletionsSamplingAsync(chatRequest, cancellationToken);
        }

        return await ResponseSamplingAsync(chatRequest, cancellationToken);
    }

    public async Task<CreateMessageResult> ChatCompletionsSamplingAsync(CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default)
    {
        var model = chatRequest.ModelPreferences?.Hints?.FirstOrDefault()?.Name;
        var responseClient = new OpenAIClient(
            _config.ApiKey
        ).GetChatClient(model);

        IEnumerable<ChatMessage> inputItems = chatRequest.Messages.ToChatMessages();
        var clientResult = await responseClient.CompleteChatAsync(inputItems, ToChatCompletionOptions(model!), cancellationToken);

        return new CreateMessageResult()
        {
            Model = clientResult.Value.Model,
            Content = new Content()
            {
                Type = "text",
                Text = clientResult.Value.Content.FirstOrDefault()?.Text
            },
            Role = ModelContextProtocol.Protocol.Role.Assistant
        };
    }


    private async Task<CreateMessageResult> ResponseSamplingAsync(CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default)
    {
        var model = chatRequest.ModelPreferences?.Hints?.FirstOrDefault()?.Name;
        var responseClient = new OpenAIResponseClient(
            model,
            _config.ApiKey
        );

        IEnumerable<ResponseItem> inputItems = chatRequest.Messages.ToResponseItems();
        var clientResult = await responseClient.CreateResponseAsync(inputItems, ToResponseCreationOptions(model!), cancellationToken);

        return new CreateMessageResult()
        {
            Model = clientResult.Value.Model,
            Content = new Content()
            {
                Type = "text",
                Text = clientResult.Value.GetOutputText()
            },
            Role = ModelContextProtocol.Protocol.Role.Assistant
        };
    }

    public async Task<IEnumerable<Model>> ListModels(CancellationToken cancellationToken = default)
    {
        var client = new OpenAIModelClient(
          _config.ApiKey
        );

        var models = await client.GetModelsAsync(cancellationToken);

        return models.Value
        .Select(a => new Model()
        {
            Id = a.Id,
            DisplayName = a.Id,
            CreatedAt = a.CreatedAt
        })
        .Where(r => CanHandleModel(r.Id));
    }

    public async IAsyncEnumerable<UIMessagePart> StreamAsync(ChatRequest chatRequest, [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var responseClient = new OpenAIResponseClient(
            chatRequest.Model ?? _config.ModelId,
            _config.ApiKey
        );

        IEnumerable<ResponseItem> inputItems = chatRequest.Messages.SelectMany(a => a.ToResponseItems());
        ResponseCreationOptions options = ToResponseCreationOptions(chatRequest.Model!);

        foreach (var tool in chatRequest.Tools ?? [])
        {
            options.Tools.Add(ResponseTool.CreateFunctionTool(tool.Name, tool.Description, BinaryData.FromObjectAsJson(tool.InputSchema)));
        }

        var stream = responseClient.CreateResponseStreamingAsync(inputItems, options,
            cancellationToken);

        await foreach (var update in stream.WithCancellation(cancellationToken))
        {
            var responseUpdate = update.ToStreamingResponseUpdate();

            if (responseUpdate != null)
            {
                yield return responseUpdate;
            }
        }
    }
}