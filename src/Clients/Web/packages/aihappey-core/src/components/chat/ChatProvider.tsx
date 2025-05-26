// Core chat provider for aihappey-core, using aihappey-ai abstraction only

import { useRef, useMemo } from "react";
import { createAiChatStore, type ChatStore, type AiChatConfig } from "aihappey-ai";
import { ChatContext } from "./ChatContext";
import type { ReactNode, FC } from "react";

export interface ChatConfig extends AiChatConfig {
  modelsApi?: string;
  samplingApi?: string;
}

export const ChatProvider: FC<{ config: ChatConfig; children: ReactNode }> = ({
  config,
  children,
}) => {
  // Memoize the chatStore so it's stable for the app lifetime
  const chatStoreRef = useRef<ChatStore<any, any>>();

  if (!chatStoreRef.current) {
    chatStoreRef.current = createAiChatStore(config);
  }

  // Optionally, you could sync selectedConversationId from zustand here if needed

  const value = useMemo(
    () => ({
      chatStore: chatStoreRef.current!,
      config,
    }),
    [config]
  );

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
