import { useChatStore } from "../../chat";

/**
 * Returns a flat array of all tool invocation activities from the current message stream.
 * Each entry includes the message id, role, and the toolInvocation payload.
 */
export const useToolInvocations = () => {
  const { messages } = useChatStore();
  return messages.flatMap((m: any) =>
    (m.parts || [])
      .filter((p: any) => p.type === "tool-invocation" && p.toolInvocation)
      .map((p: any) => ({
        msgId: m.id,
        role: m.role,
        ...p.toolInvocation,
      }))
  );
};
