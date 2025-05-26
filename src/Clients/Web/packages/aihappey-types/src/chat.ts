// Chat domain primitives

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string; // ISO string
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
