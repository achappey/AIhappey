
namespace AIhappey.Core.WebApi.Models;

public class Model
{
    public string Id { get; set; } = default!;

    public string DisplayName { get; set; } = default!;
    
    public DateTimeOffset CreatedAt { get; set; } = default!;
}
