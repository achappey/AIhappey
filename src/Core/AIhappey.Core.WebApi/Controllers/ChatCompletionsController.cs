using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using AIhappey.Core.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.Serialization;

namespace AIhappey.Core.WebApi.Controllers;

[ApiController]
[Route("chat/completions")]
public class ChatCompletionsController(AIhappey.Core.WebApi.AI.AIModelProviderResolver resolver) : ControllerBase
{
    private readonly AIhappey.Core.WebApi.AI.AIModelProviderResolver _resolver = resolver;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] RequestDto requestDto, CancellationToken cancellationToken)
    {
        if (requestDto == null || requestDto.Input == null || string.IsNullOrWhiteSpace(requestDto.Model))
            return BadRequest(new { error = "'input' (history array) and 'model' are required fields" });

        var provider = _resolver.Resolve(requestDto.Model);

        Response.ContentType = "text/event-stream";
        Response.Headers["x-vercel-ai-ui-message-stream"] = "v1";

        await using var writer = new StreamWriter(Response.Body);

        // Stream a single text part
        UIMessagePart part = new TextUIPart()
        {
            //Type = "text",
            Text = "Hello from streaming response!"
        };
        var partJson = JsonSerializer.Serialize(part, JsonSerializerOptions.Web);
        await writer.WriteAsync($"data: {partJson}\n\n");
        await writer.FlushAsync();

        // Send finish event
        await writer.WriteAsync("data: {\"type\":\"finish\"}\n\n");
        await writer.FlushAsync();
        return new EmptyResult();
    }
}

