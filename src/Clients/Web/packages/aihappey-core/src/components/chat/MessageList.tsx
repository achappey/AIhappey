import { useTheme } from "../../ThemeContext";
import { useChatStore } from "../chat/useChatStore";

function toMarkdownLinkSmart(toolInvocation: any): string {
  const prettyArgs = JSON.stringify(JSON.parse(toolInvocation.args), null, 2);
  const prettyResult = JSON.stringify(toolInvocation.result, null, 2);

  return `${toolInvocation.toolName}\n\n\`\`\`\n${prettyArgs}\n\`\`\`\n\n\`\`\`\n${prettyResult}\n\`\`\``;
}

export const MessageList = () => {
  const { messages } = useChatStore();
  const { Chat } = useTheme();

  const chatMessages = messages.flatMap((r) =>
    r.parts
      .filter((a) => a.type == "text" || a.type == "reasoning")
      .map((z: any) => ({
        content: z.text,
        role: r.role,
        id: r.id,
        createdAt: "",
      }))
  );

  console.log(messages);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
      {chatMessages.length > 0 && <Chat messages={chatMessages} />}
    </div>
  );
};
