using AIhappey.Core.WebApi.Models;

namespace AIhappey.Core.WebApi;

public static class GoogleAIModels
{

    public static class GoogleModels
    {
        public static List<Model> AllModels { get; } =
    [
        new Model
        {
            Id = "gemini-2.5-flash-preview-04-17",
            DisplayName = "Gemini 2.5 Flash Preview",
            CreatedAt = DateTime.Parse("2025-04-17T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.0-flash-exp",
            DisplayName = "Gemini 2.0 Flash Experimental",
            CreatedAt = DateTime.Parse("2024-12-11T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.0-flash-exp-image-generation",
            DisplayName = "Gemini 2.0 Flash Experimental Image Generation",
            CreatedAt = DateTime.Parse("2024-12-11T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.0-flash-thinking-exp-01-21",
            DisplayName = "Gemini 2.0 Flash Thinking Experimental",
            CreatedAt = DateTime.Parse("2025-01-21T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-exp-1206",
            DisplayName = "Gemini Experimental 1206",
            CreatedAt = DateTime.Parse("2024-12-06T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.0-flash",
            DisplayName = "Gemini 2.0 Flash",
            CreatedAt = DateTime.Parse("2025-02-05T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.0-flash-lite",
            DisplayName = "Gemini 2.0 Flash Lite",
            CreatedAt = DateTime.Parse("2025-02-05T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.5-pro-exp-03-25",
            DisplayName = "Gemini 2.5 Pro Experimental",
            CreatedAt = DateTime.Parse("2025-03-25T00:00:00Z"),
        },
        new Model
        {
            Id = "gemini-2.5-pro-preview-05-06",
            DisplayName = "Gemini 2.5 Pro Preview",
            CreatedAt = DateTime.Parse("2025-05-06T00:00:00Z"),
        },
    ];
    }
}
