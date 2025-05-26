using AIhappey.Core.WebApi.Models;

namespace AIhappey.Core.WebApi.AI;

public interface IModelProvider
{
    bool CanHandleModel(string model);
    Task<UIMessagePart> CompleteAsync(ChatRequest chatRequest, CancellationToken cancellationToken = default);
    Task<IEnumerable<Model>> ListModels(CancellationToken cancellationToken = default);
    public Task<ModelContextProtocol.Protocol.CreateMessageResult> SamplingAsync(ModelContextProtocol.Protocol.CreateMessageRequestParams chatRequest, CancellationToken cancellationToken = default);
    IAsyncEnumerable<UIMessagePart> StreamAsync(ChatRequest chatRequest, CancellationToken cancellationToken = default);
}

