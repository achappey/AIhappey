using AIhappey.Core.WebApi.Models;

namespace AIhappey.Core.WebApi.Extensions.Google;

public static class GoogleExtensions
{
    private static readonly Dictionary<string, (string callId, string name, string args)> _toolCallArgs = new();

    public static UIMessagePart? ToStreamingResponseUpdate(this Mscc.GenerativeAI.GenerateContentResponse update)
    {
        if (!string.IsNullOrEmpty(update.Text))

        {
            return new TextUIPart
            {
                Text = update.Text
            };
        }

        return null;
    }
    
    public static Mscc.GenerativeAI.ContentResponse ToContentResponse(this ModelContextProtocol.Protocol.SamplingMessage samplingMessage)
    {
        return new Mscc.GenerativeAI.ContentResponse(samplingMessage.Content.Text!)
        {
            Role = samplingMessage.Role == ModelContextProtocol.Protocol.Role.User ? "user" : "model",
        };
    }

    public static Mscc.GenerativeAI.ContentResponse ToContentResponse(this UIMessage message)
    {
        return new Mscc.GenerativeAI.ContentResponse(message.Parts
            .OfType<TextUIPart>()
            .FirstOrDefault()?.Text!)
        {
            Role = message.Role == Role.user ? "user" : "model",
            Parts = message.Parts
            .OfType<TextUIPart>()
          //  .Skip(1)
            .Select(a => new Mscc.GenerativeAI.Part()
            {
                Text = a.Text,
            }).ToList()
        };

    }
}