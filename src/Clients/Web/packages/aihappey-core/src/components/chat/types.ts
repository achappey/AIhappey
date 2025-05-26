import type { Conversation, Message } from "aihappey-types/src/chat";
import type { UIMessage } from "ai";

// Helper type for UIMessage with any generics
export type UIMessageX = UIMessage<any, any>;

export type { Conversation, Message };
