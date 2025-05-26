import { createContext, useContext } from "react";
import type { ChatStore } from "ai";
import type { ChatConfig } from "./ChatProvider";

interface ChatContextType {
  chatStore: ChatStore<any, any>;
  config: ChatConfig;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};

export type { ChatConfig };
