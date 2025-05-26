using System.Threading.Tasks;
using AIhappey.Core.WebApi.Models;

namespace AIhappey.Core.WebApi.AI;

public class AIModelProviderResolver(IEnumerable<IModelProvider> providers)
{
    private readonly IEnumerable<IModelProvider> _providers = providers;

    public IModelProvider Resolve(string model)
    {
        var provider = _providers.FirstOrDefault(p => p.CanHandleModel(model));
        if (provider == null)
            throw new NotSupportedException($"No provider found for model '{model}'");
        return provider;
    }

    public async Task<IEnumerable<Model>> ResolveModels(CancellationToken cancellationToken)
    {
        List<Model> models = [];

        foreach (var provider in _providers)
        {
            models.AddRange(await provider.ListModels(cancellationToken));
        }

        return models.OrderBy(a => a.DisplayName);
    }
    
}

