using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ModelContextProtocol.Protocol;

namespace AIhappey.Core.WebApi.Controllers;

[ApiController]
[Route("sampling")]
public class SamplingController(AI.AIModelProviderResolver resolver) : ControllerBase
{
    private readonly AI.AIModelProviderResolver _resolver = resolver;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] CreateMessageRequestParams requestDto, CancellationToken cancellationToken)
    {
        var model = requestDto.ModelPreferences?.Hints?.FirstOrDefault()?.Name;
        var provider = _resolver.Resolve(model ?? "gpt-4.1-nano");
        var result = await provider.SamplingAsync(requestDto, cancellationToken);

        return new JsonResult(result);
    }
}

