import { createAppStore, type RootState } from "./createAppStore";
import { useStore } from "zustand";
import type { ServersSlice } from "./slices/serversSlice";
import type { ChatSlice } from "./slices/chatSlice";
import type { LoggingMessageNotification } from "aihappey-mcp";

const store = createAppStore();

export const useAppStore = <T>(selector: (state: RootState) => T): T =>
  useStore(store, selector);

export const useUi = () =>
  useAppStore((s) => ({
    showActivities: s.showActivities,
    toggleActivities: s.toggleActivities,
    setActivities: s.setActivities,
  }));

export const useServers = () =>
  useAppStore((s) => ({
    servers: s.servers,
    resources: s.resources,
    prompts: s.prompts,
    tools: s.tools,
    selected: s.selected,
    selectedServers: s.selectedServers,
    addServer: s.addServer,
    removeServer: s.removeServer,
    selectServers: s.selectServers,
    resetServers: s.resetServers,
  }) as ServersSlice);

export const useChat = () =>
  useAppStore((s) => ({
    conversations: s.conversations,
    selectedConversationId: s.selectedConversationId,
    createConversation: s.createConversation,
    updateConversationName: s.updateConversationName,
    addMessage: s.addMessage,
    updateMessage: s.updateMessage,
    removeConversation: s.removeConversation,
    selectConversation: s.selectConversation,
    getConversation: s.getConversation,
  }) as ChatSlice);

export const useMcpNotifications = (): LoggingMessageNotification[] =>
  useAppStore((s) => {
    return s.notifications;
  });

export { createAppStore };
