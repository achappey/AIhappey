import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { ServersSlice } from "./slices/serversSlice";
import type { ChatSlice } from "./slices/chatSlice";
import { McpSlice } from "./slices/mcpSlice";
import { UiSlice } from "./slices/uiSlice";

type RootState = ServersSlice & ChatSlice & McpSlice & UiSlice;

export const withPersist = (creator: StateCreator<RootState, [], [], RootState>) =>
  persist(creator, {
    name: "aihappey_store_v3",
    partialize: (s) => ({
      servers: s.servers,
      selected: s.selected,
      selectedServers: s.selectedServers,
      conversations: s.conversations,
      selectedConversationId: s.selectedConversationId,
    }),
    merge: (persisted: any, current: RootState) => ({
      ...current,
      ...persisted,
    }),
  });
