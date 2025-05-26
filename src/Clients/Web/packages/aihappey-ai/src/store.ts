import { ChatStoreEvent, defaultChatStore, type ChatStore } from "ai";

export interface AiChatConfig {
  api: string;
  getAccessToken?: () => Promise<string>;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}
const LS_KEY = "aihappey_ai_chats_v1";

function loadChats() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export const createAiChatStore = (config?: AiChatConfig): ChatStore<any, any> => {
  const store = defaultChatStore({
    api: config?.api ?? "/api/chat",
    maxSteps: 15,
    chats: loadChats(),
    fetch: async (input, init) => {
      let headers: Record<string, string> = { ...(config?.headers || {}) };
      if (config?.getAccessToken) {
        const token = await config.getAccessToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (init?.headers) {
        headers = { ...headers, ...(init.headers as Record<string, string>) };
      }
      return (config?.fetch || fetch)(input, { ...init, headers });
    }
    // model is not a valid option for defaultChatStore, so it is ignored here
  })

  const save = () => {
    const chatsObj = Object.fromEntries(
      store.getChats().map(([id, chat]) => [id, { messages: chat.messages }])
    );
    try { localStorage.setItem(LS_KEY, JSON.stringify(chatsObj)); } catch { }
  }

  store.subscribe({
    onChatChanged: (e) => {
      if (e.type === "chat-messages-changed") save();
    }
  })
  /*
  
  interface ChatStoreEvent {
      type: 'chat-messages-changed' | 'chat-status-changed';
      chatId: number | string;
      error?: Error;
  }*/
  return store;
}
