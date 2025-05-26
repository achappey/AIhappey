const esbuild = require("esbuild");

const isWatch = process.argv.includes("--watch");

// Expect env var to be a JSON string array, e.g., '["url1", "url2"]'
const defaultUrlsEnv = process.env.DEFAULT_MCP_SERVER_LIST_URLS_JSON;
let defaultUrls = ["http://localhost:3001/mcp.json"]; // Default fallback array
const chatApi = process.env.CHAT_API_URL || "http://localhost:3010/api/chat";
const modelsApi = process.env.MODELS_API_URL || "http://localhost:3010/models";
const samplingApi = process.env.SAMPLING_API_URL || "http://localhost:3010/sampling";
const msalClientId = process.env.MSAL_CLIENT_ID || "3103139a-fc1c-483c-b66d-e2b177ca1fa3";
const msalAuthority = process.env.MSAL_AUTHORITY || "https://login.microsoftonline.com/653b45ef-ba50-42b5-8576-1be3b5f03b6a";
const msalRedirectUri = process.env.MSAL_REDIRECT_URI || "/";
const msalScopes = process.env.MSAL_SCOPES ? JSON.parse(process.env.MSAL_SCOPES) : ["api://fakton.chat/AI.use"];

if (defaultUrlsEnv) {
  try {
    const parsed = JSON.parse(defaultUrlsEnv);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      defaultUrls = parsed;
    } else {
      console.warn("Invalid format for DEFAULT_MCP_SERVER_LIST_URLS_JSON env var. Using default.");
    }
  } catch (e) {
    console.warn("Error parsing DEFAULT_MCP_SERVER_LIST_URLS_JSON env var. Using default.", e);
  }
}

const buildOptions = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "public/bundle.js",
  sourcemap: true,
  minify: false, // Keep false for easier debugging if needed
  define: {
    "process.env.NODE_ENV": isWatch ? '"development"' : '"production"', // Adjust based on watch/build
    // Define the new constant, ensuring the value is a stringified array
    "__DEFAULT_MCP_SERVER_LIST_URLS__": JSON.stringify(defaultUrls),
    "__CHAT_API__": JSON.stringify(chatApi),
    "__MODELS_API__": JSON.stringify(modelsApi),
    "__SAMPLING_API__": JSON.stringify(samplingApi),
    "__MSAL_CLIENT_ID__": JSON.stringify(msalClientId),
    "__MSAL_AUTHORITY__": JSON.stringify(msalAuthority),
    "__MSAL_REDIRECT_URI__": JSON.stringify(msalRedirectUri),
    "__MSAL_SCOPES__": JSON.stringify(msalScopes),
  },
  loader: { ".tsx": "tsx", ".ts": "ts" },
};

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log("Watching for changes...");
  }).catch(() => process.exit(1));
} else {
  esbuild.build(buildOptions)
    .then(() => {
      console.log("Build complete.");
    })
    .catch(() => process.exit(1));
}
