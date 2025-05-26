using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AIhappey.Core.WebApi.Controllers;

[ApiController]
[Route("models")]
public class ModelsController(AI.AIModelProviderResolver resolver) : ControllerBase
{
    private readonly AI.AIModelProviderResolver _resolver = resolver;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
        => new JsonResult(await _resolver.ResolveModels(cancellationToken));
}

