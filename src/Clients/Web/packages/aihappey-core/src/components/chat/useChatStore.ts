import { useAiChat } from "aihappey-ai";
import { useChatContext } from "./ChatContext";
import { useConversations } from "./useConversations";
import { useAppStore } from "aihappey-state";

// Hook for AI chat logic, always uses current chatStore and selected conversation
export const useChatStore = () => {
  const { chatStore, config } = useChatContext();
  const { selectedConversationId } = useConversations();
  const callTool = useAppStore((s) => s.callTool);

  // Use aihappey-ai's useAiChat, always with our chatStore and selectedConversationId
  return useAiChat({
    chatStore,
    onFinish: (opts) => {console.log("BLAAAAA");console.log(opts)}, // SAVE ASSISTANT MESSAGE TO LOCALSTORE HERE
    onError: (err) => console.error(err),
    onToolCall: async ({ toolCall }) => {
      const result = await callTool(toolCall.toolCallId, toolCall.toolName, toolCall.args);

      await chatStore.addToolResult({
        chatId: selectedConversationId!,
        toolCallId: toolCall.toolCallId,
        result: result ?? "something went wrong. Please try your tool call again",
      });

      return result;

    },
    id: selectedConversationId ?? undefined,
  });
};
