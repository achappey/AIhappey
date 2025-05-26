import type { StateCreator } from "zustand";
import type { Conversation, Message } from "aihappey-types/src/chat";

export type ChatSlice = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  createConversation: (name: string) => Conversation;
  updateConversationName: (id: string, name: string) => void;
  addMessage: (cid: string, msg: Message) => void;
  updateMessage: (cid: string, mid: string, up: Partial<Message>) => void;
  removeConversation: (id: string) => void;
  selectConversation: (id: string | null) => void;
  getConversation: (id: string) => Conversation | undefined;
};

const now = () => new Date().toISOString();

export const createChatSlice: StateCreator<
  any,
  [],
  [],
  ChatSlice
> = (set, get, store) => ({
  conversations: [],
  selectedConversationId: null,
  createConversation: (name) => {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      name,
      messages: [],
      createdAt: now(),
      updatedAt: now(),
    };
    set((s: any) => ({
      conversations: [conv, ...s.conversations],
    }));
    return conv;
  },
  updateConversationName: (id, name) =>
    set((s: any) => ({
      conversations: s.conversations.map((c: Conversation) =>
        c.id === id ? { ...c, name, updatedAt: now() } : c
      ),
    })),
  addMessage: (cid, msg) =>
    set((s: any) => ({
      conversations: s.conversations.map((c: Conversation) =>
        c.id === cid
          ? { ...c, messages: [...c.messages, msg], updatedAt: now() }
          : c
      ),
    })),
  updateMessage: (cid, mid, up) =>
    set((s: any) => ({
      conversations: s.conversations.map((c: Conversation) =>
        c.id === cid
          ? {
              ...c,
              messages: c.messages.map((m: Message) =>
                m.id === mid ? { ...m, ...up } : m
              ),
              updatedAt: now(),
            }
          : c
      ),
    })),
  removeConversation: (id) =>
    set((s: any) => ({
      conversations: s.conversations.filter((c: Conversation) => c.id !== id),
    })),
  selectConversation: (id) =>
    set(() => ({
      selectedConversationId: id,
    })),
  getConversation: (id) =>
    get().conversations.find((c: Conversation) => c.id === id),
});
