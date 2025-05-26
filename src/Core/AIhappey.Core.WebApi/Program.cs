using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using AIhappey.Core.WebApi.Providers;
using AIhappey.Core.WebApi;
using AIhappey.Core.WebApi.AI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<AIServiceConfig>(
    builder.Configuration.GetSection("AIServices"));

// Add authentication/authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddAuthorization();

// CORS for SPA (adjust origin as needed)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
              .AllowAnyHeader()
              .AllowAnyOrigin()
              .AllowAnyMethod()
             // .AllowCredentials()
              .WithExposedHeaders("WWW-Authenticate");
    });
});

// Load config for conditional provider registration
var aiConfig = builder.Configuration.GetSection("AIServices").Get<AIServiceConfig>();

if (aiConfig?.OpenAI?.ApiKey is { Length: > 0 })
{
    builder.Services.AddSingleton<IModelProvider, OpenAIProvider>();
}
if (aiConfig?.Google?.ApiKey is { Length: > 0 })
{
    builder.Services.AddSingleton<IModelProvider, GoogleAIProvider>();
}

if (aiConfig?.Anthropic?.ApiKey is { Length: > 0 })
{
    builder.Services.AddSingleton<IModelProvider, AnthropicProvider>();
}

builder.Services.AddSingleton<AIModelProviderResolver>();
builder.Services.AddControllers();
var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();  

app.Run();
