// Root component for MCP Happey apps: loads server lists, manages state, renders server list UI.
// Requires a ThemeProvider (throws if missing).

import { useTheme } from "./ThemeContext";
import { ChatProvider, ChatConfig } from "./components/chat";
import { ChatPage } from "./components/pages/ChatPage";
import { useRemoteMcpServers } from "./components/mcp/useRemoteMcpServers";
import { McpConnectionsProvider } from "./components/mcp/McpConnectionsProvider";

// --- AUTH INTEGRATION ---
import {
  AuthConfig,
  initAuth,
  acquireAccessToken,
  MsalAuthenticationTemplate,
  InteractionType,
  MsalAuthProvider,
} from "aihappey-auth";
import { useMemo } from "react";

type CoreRootProps = {
  initialLists?: string[];
  allowCustomLists?: boolean;
  chatConfig?: ChatConfig;
  authConfig?: AuthConfig;
};

export const CoreRoot = ({
  initialLists = [],
  chatConfig,
  authConfig,
}: CoreRootProps) => {
  useTheme(); // Throws if no provider

  useRemoteMcpServers(initialLists);

  // 1. init MSAL when config provided
  const msalInstance = useMemo(
    () => (authConfig ? initAuth(authConfig) : null),
    [authConfig]
  );

  // 2. merge chatConfig with auth if msal present
  const mergedChatConfig = useMemo<ChatConfig | undefined>(() => {
    if (!authConfig) return chatConfig;
    // Ensure api is always present (required by AiChatConfig)
    const api = chatConfig?.api ?? "/api/chat";
    return {
      ...chatConfig,
      api,
      getAccessToken: () => acquireAccessToken(authConfig.msal.scopes),
    };
  }, [chatConfig, authConfig]);

  const chatUi = mergedChatConfig ? (
    <ChatProvider config={mergedChatConfig}>
      <ChatPage />
    </ChatProvider>
  ) : (
    <div>Loaded</div>
  );

  const wrappedUi = (
    <McpConnectionsProvider samplingApi={mergedChatConfig?.samplingApi}>
      {chatUi}
    </McpConnectionsProvider>
  );

  return msalInstance ? (
    <MsalAuthProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={{ scopes: authConfig!.msal.scopes }}
      >
        {wrappedUi}
      </MsalAuthenticationTemplate>
    </MsalAuthProvider>
  ) : (
    <>{wrappedUi}</>
  );
};

export default CoreRoot;
