namespace AIhappey.Core.WebApi;

public class AIServiceConfig
{
    public ProviderConfig? AzureOpenAI { get; set; }
    public ProviderConfig? OpenAI { get; set; }
    public ProviderConfig? Google { get; set; }
    public ProviderConfig? Anthropic { get; set; }
    public ProviderConfig? Perplexity { get; set; }
}

public class ProviderConfig
{
    public string? ModelId { get; set; }
    public string ApiKey { get; set; } = null!;
    public string? Endpoint { get; set; }
    public string? DeploymentName { get; set; }
}

