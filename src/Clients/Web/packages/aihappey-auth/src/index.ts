export { default as OAuthCallbackPage } from "./OAuthCallbackPage";
export * from "./initAuth";
export { createMsalInstance, MsalAuthProvider } from "./msal/provider";
export { acquireAccessToken } from "./msal/acquireToken";
export { getMcpAccessToken, initiateMcpOAuthFlow } from "./mcp/helpers";
export type { AuthConfig } from "./config/types";
export { MsalAuthenticationTemplate } from "@azure/msal-react";
export { InteractionType } from "@azure/msal-browser";
