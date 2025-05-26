using Microsoft.Extensions.Options;
using AIhappey.Core.WebApi.AI;
using AIhappey.Core.WebApi.Models;
using ModelContextProtocol.Protocol;
using AIhappey.Core.WebApi.Extensions.Google;

namespace AIhappey.Core.WebApi.Providers;

public class GoogleAIProvider(IOptions<AIServiceConfig> config, ILogger<GoogleAIProvider> logger) : IModelProvider
{
    private readonly ProviderConfig _config = config.Value.Google!;
    private Mscc.GenerativeAI.GoogleAI googleAI = new(config.Value.Google?.ApiKey, logger: logger);

    public bool CanHandleModel(string model) =>
        !string.IsNullOrWhiteSpace(model) && model.StartsWith("gemini-", StringComparison.OrdinalIgnoreCase);

    public Task<IEnumerable<Model>> ListModels(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IEnumerable<Model>>(GoogleAIModels.GoogleModels.AllModels);
    }

    public async Task<UIMessagePart> CompleteAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        // var model = request.ModelPreferences?.Hints?.FirstOrDefault()?.Name;

        List<Mscc.GenerativeAI.ContentResponse> inputItems = request.Messages.SkipLast(1).Select(a => a.ToContentResponse()).ToList();

        Mscc.GenerativeAI.ChatSession chat = CreateChatSession(request.Model!, string.Empty, inputItems,
                 1, topP: null, useGoogleSearch: true, null);
        List<Mscc.GenerativeAI.Part> parts = [new Mscc.GenerativeAI.Part() { Text = request.Messages?.LastOrDefault()?.Parts.OfType<TextUIPart>()?
            .LastOrDefault()?.Text! }];

        var response = await chat.SendMessage(parts, cancellationToken: cancellationToken);

        return new TextUIPart
        {
            Text = response.Text!
        };
    }

    public async IAsyncEnumerable<UIMessagePart> StreamAsync(ChatRequest request, [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        List<Mscc.GenerativeAI.ContentResponse> inputItems = request.Messages.SkipLast(1).Select(a => a.ToContentResponse()).ToList();

        Mscc.GenerativeAI.ChatSession chat = CreateChatSession(request.Model!, string.Empty, inputItems,
                 1, topP: null, useGoogleSearch: true, null);
        List<Mscc.GenerativeAI.Part> parts = [new Mscc.GenerativeAI.Part() { Text = request.Messages?.LastOrDefault()?.Parts.OfType<TextUIPart>()?
            .LastOrDefault()?.Text! }];

        var response = chat.SendMessageStream(parts, cancellationToken: cancellationToken);

        await foreach (var update in response.WithCancellation(cancellationToken))
        {
            var responseUpdate = update.ToStreamingResponseUpdate();

            if (responseUpdate != null)
            {
                yield return responseUpdate;
            }
        }
    }

    public async Task<CreateMessageResult> SamplingAsync(CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default)
    {
        var model = chatRequest.ModelPreferences?.Hints?.FirstOrDefault()?.Name;

        List<Mscc.GenerativeAI.ContentResponse> inputItems = chatRequest.Messages.SkipLast(1).Select(a => a.ToContentResponse()).ToList();

        Mscc.GenerativeAI.ChatSession chat = CreateChatSession(model!, string.Empty, inputItems,
                 chatRequest.Temperature, topP: null, useGoogleSearch: true, null);
        List<Mscc.GenerativeAI.Part> parts = [new Mscc.GenerativeAI.Part() { Text = chatRequest.Messages.LastOrDefault()?.Content.Text! }];

        var response = await chat.SendMessage(parts, cancellationToken: cancellationToken);

        return new CreateMessageResult()
        {
            Model = response.ModelVersion!,
            Content = new Content()
            {
                Type = "text",
                Text = response.Text
            },
            Role = ModelContextProtocol.Protocol.Role.Assistant
        };
    }

    private Mscc.GenerativeAI.ChatSession CreateChatSession(
               string model, string systemInstructions, List<Mscc.GenerativeAI.ContentResponse> history,
               float? temperature,
               float? topP,
               bool? useGoogleSearch,
               List<Mscc.GenerativeAI.Tool>? tools = null)
    {
        var isFlashExp = model.Contains("flash-exp");

        Mscc.GenerativeAI.Content? systemInstruction = !string.IsNullOrEmpty(systemInstructions)
            && !isFlashExp ? new(systemInstructions) : null;
        Mscc.GenerativeAI.GenerationConfig generationConfig = new()
        {
            Temperature = temperature,
            TopP = topP,
        };

        var generativeModel = googleAI.GenerativeModel(model,
            systemInstruction: systemInstruction,
            tools: tools);

        generationConfig.ResponseModalities = isFlashExp ? [Mscc.GenerativeAI.ResponseModality.Text, Mscc.GenerativeAI.ResponseModality.Image]
            : [Mscc.GenerativeAI.ResponseModality.Text];

        if (useGoogleSearch == true && !isFlashExp)
        {
            if (model.Contains("1.5") == true)
            {
                generativeModel.UseGrounding = true;
            }
            else
            {
                generativeModel.UseGoogleSearch = !model.Contains("lite");
            }
        }

        return generativeModel.StartChat(history, generationConfig);
    }



}

