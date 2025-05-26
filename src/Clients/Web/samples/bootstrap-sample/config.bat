@echo off
REM Sets your MCP URLs for ESBuild injection
set DEFAULT_MCP_SERVER_LIST_URLS_JSON=["http://localhost:3001/mcp.json"]

REM (Optional) If you want to override chat API endpoints via env:
set CHAT_API_URL=http://localhost:3010/api/chat
set MODELS_API_URL=http://localhost:3010/models
set SAMPLING_API_URL=http://localhost:3010/sampling

REM (Optional) MSAL/Authentication config (only if you want to inject via env):
set MSAL_CLIENT_ID=your-client-id-here
set MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
set MSAL_REDIRECT_URI=/
set MSAL_SCOPES=["user.read"]

REM Run your build (build.js must read from process.env if you want to use these above)
npm run dev 
