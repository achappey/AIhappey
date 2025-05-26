using Microsoft.Extensions.Options;
using AIhappey.Core.WebApi.AI;
using AIhappey.Core.WebApi.Models;
using Anthropic.SDK;
using Anthropic.SDK.Messaging;
using ModelContextProtocol.Protocol;
using System.Text.Json;
using AIhappey.Core.WebApi.Extensions.Anthropic;

namespace AIhappey.Core.WebApi.Providers;

public class AnthropicProvider(IOptions<AIServiceConfig> config) : IModelProvider
{
    private readonly ProviderConfig _config = config.Value.Anthropic!;

    public bool CanHandleModel(string model) =>
        !string.IsNullOrWhiteSpace(model) && model.StartsWith("claude-", StringComparison.OrdinalIgnoreCase);

    public async Task<UIMessagePart> CompleteAsync(ChatRequest chatRequest, CancellationToken cancellationToken = default)
    {
        var client = new AnthropicClient(
            _config.ApiKey
        );

        IEnumerable<Message> inputItems = chatRequest.Messages.SelectMany(a => a.ToMessages());
        var tools = chatRequest.Tools?.Select(a => new Anthropic.SDK.Common.Tool(new Anthropic.SDK.Common.Function(
                                a?.Name,
                                a?.Description,
                                a?.InputSchema?.ToString())));


        var clientResult = await client.Messages
            .GetClaudeMessageAsync(inputItems
                .ToMessageParameters(chatRequest.Model ?? _config.ModelId!, tools),
                ctx: cancellationToken);

        var result = clientResult.Content.OfType<TextContent>();

        return new TextUIPart
        {
            Text = string.Join("\n\n", result)
        };
    }

    public async Task<IEnumerable<Model>> ListModels(CancellationToken cancellationToken = default)
    {
        var client = new AnthropicClient(
          _config.ApiKey
        );

        var models = await client.Models.ListModelsAsync(ctx: cancellationToken);

        return models.Models
        .Select(a => new Model()
        {
            Id = a.Id,
            DisplayName = a.Id,
            CreatedAt = a.CreatedAt
        })
        .Where(r => CanHandleModel(r.Id));
    }

    public async Task<CreateMessageResult> SamplingAsync(CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default)
    {
        var model = chatRequest.ModelPreferences?.Hints?.FirstOrDefault()?.Name;
        var responseClient = new AnthropicClient(
            _config.ApiKey
        );

        var inputItems = chatRequest.Messages.ToMessages();

        var clientResult = await responseClient.Messages
           .GetClaudeMessageAsync(inputItems
               .ToMessageParameters(model!, []),
               ctx: cancellationToken);

        var result = clientResult.Content.OfType<TextContent>();

        return new CreateMessageResult()
        {
            Model = clientResult.Model,
            Content = new Content()
            {
                Type = "text",
                Text = string.Join("\n\n", result)
            },
            Role = ModelContextProtocol.Protocol.Role.Assistant
        };
    }

    public async IAsyncEnumerable<UIMessagePart> StreamAsync(ChatRequest chatRequest, [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var responseClient = new AnthropicClient(
            _config.ApiKey
        );

        IEnumerable<Message> inputItems = chatRequest.Messages.SelectMany(a => a.ToMessages());
        var tools = chatRequest.Tools?.Select(a => new Anthropic.SDK.Common.Tool(new Anthropic.SDK.Common.Function(
                        a?.Name,
                        a?.Description,
                        JsonSerializer.Serialize(a?.InputSchema, JsonSerializerOptions.Web))));

        var stream = responseClient.Messages.StreamClaudeMessageAsync(inputItems
                .ToMessageParameters(chatRequest.Model ?? _config.ModelId!, tools), ctx: cancellationToken);

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