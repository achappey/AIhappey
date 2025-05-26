using System.Text.Json.Serialization;

namespace AIhappey.Core.WebApi.Models;

public class ChatRequest
{
    public string Id { get; set; } = default!;
    public List<UIMessage> Messages { get; set; } = [];
    public string Model { get; set; } = null!;
    public List<Tool>? Tools { get; set; } = [];
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Role
{
    system,
    user,
    assistant
}

public class UIMessage
{
    public string Id { get; init; } = default!;

    public Role Role { get; init; }

    public List<UIMessagePart> Parts { get; init; } = new();

    public Dictionary<string, object>? Metadata { get; init; }
}

public class CreateUIMessage : UIMessage
{
    public new string? Id { get; init; }
}

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(TextUIPart), "text")]
[JsonDerivedType(typeof(ReasoningUIPart), "reasoning")]
[JsonDerivedType(typeof(ToolInvocationPart), "tool-invocation")]
[JsonDerivedType(typeof(ToolCallPart), "tool-call")]
[JsonDerivedType(typeof(SourceUIPart), "source")]
[JsonDerivedType(typeof(FileUIPart), "file")]
[JsonDerivedType(typeof(StepStartUIPart), "step-start")]
//[JsonDerivedType(typeof(DataUIPart<JsonElement>), "data-table")] // Add more if needed
public abstract class UIMessagePart
{
}

public class TextUIPart : UIMessagePart
{
    public string Text { get; init; } = default!;
}

public class ReasoningUIPart : UIMessagePart
{
    public string Text { get; init; } = default!;
    public Dictionary<string, object>? ProviderMetadata { get; init; }
}


public class ToolCallPart : UIMessagePart
{
    public string ToolCallId { get; init; } = default!;
    public string ToolName { get; init; } = default!;
    public object Args { get; init; } = default!;
}


public class ToolInvocationPart : UIMessagePart
{
    public ToolInvocation ToolInvocation { get; init; } = default!;

}

public class SourceUIPart : UIMessagePart
{
    public Source Source { get; init; } = default!;
}

public class FileUIPart : UIMessagePart
{
    public string MediaType { get; init; } = default!;
    public string? Filename { get; init; }
    public string Url { get; init; } = default!;
}

public class StepStartUIPart : UIMessagePart
{
}

public class Source
{
    public string SourceType { get; init; } = "url";
    public string Id { get; init; } = default!;
    public string Url { get; init; } = default!;
    public string? Title { get; init; }
    public Dictionary<string, object>? ProviderMetadata { get; init; }
}

public class ToolInvocation
{
    public string ToolCallId { get; init; } = default!;
    public string ToolName { get; init; } = default!;
    public string Args { get; init; } = default!;
    public string State { get; init; } = default!;
    public object Result { get; init; } = default!;
}