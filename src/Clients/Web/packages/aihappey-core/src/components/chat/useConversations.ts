import { useAppStore } from "aihappey-state";
import type { Conversation } from "./types";

// Hook for conversation CRUD/select logic from zustand chatSlice
export const useConversations = () => {
  const conversations = useAppStore((s) => s.conversations as Conversation[]);
  const selectedConversationId = useAppStore((s) => s.selectedConversationId as string | null);
  const createConversation = useAppStore((s) => s.createConversation);
  const updateConversationName = useAppStore((s) => s.updateConversationName);
  const removeConversation = useAppStore((s) => s.removeConversation);
  const selectConversation = useAppStore((s) => s.selectConversation);
  const getConversation = useAppStore((s) => s.getConversation);
  const addMessage = useAppStore((s) => s.addMessage);
  const updateMessage = useAppStore((s) => s.updateMessage);

  return {
    conversations,
    selectedConversationId,
    createConversation,
    updateConversationName,
    removeConversation,
    selectConversation,
    getConversation,
    addMessage,
    updateMessage,
  };
};
