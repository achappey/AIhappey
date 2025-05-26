using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using AIhappey.Core.WebApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace AIhappey.Core.WebApi.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController(AI.AIModelProviderResolver resolver) : ControllerBase
{
    private readonly AI.AIModelProviderResolver _resolver = resolver;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ChatRequest chatRequest, CancellationToken cancellationToken)
    {
        var provider = _resolver.Resolve(chatRequest.Model);

        Response.ContentType = "text/event-stream";
        Response.Headers["x-vercel-ai-ui-message-stream"] = "v1";

        await using var writer = new StreamWriter(Response.Body);

        await foreach (var response in provider.StreamAsync(chatRequest, cancellationToken))
        {
            await Response.WriteAsync($"data: {JsonSerializer.Serialize(response, JsonSerializerOptions.Web)}\n\n");
            await Response.Body.FlushAsync();
        }

        await writer.WriteAsync("data: {\"type\":\"finish\"}\n\n");
        await writer.FlushAsync();
        return new EmptyResult();
    }
}

