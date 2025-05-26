import { useChatStore } from "../chat/useChatStore";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useTheme } from "../../ThemeContext";
import { useAppStore } from "aihappey-state";

interface ChatPanelProps {
  model?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ model }) => {
  const { append, status } = useChatStore();
  const { Spinner } = useTheme();

  const pending = status == "submitted" || status == "streaming";
  const resourceResults = useAppStore((s) => s.resourceResults);
  const tools = useAppStore((s) => s.tools);
  const clearResourceResults = useAppStore((s) => s.clearResourceResults);

  const handleSend = async (content: string) => {
    // Compose message parts: resourceResults first, then user text
    const parts: any[] = [
      ...resourceResults.flatMap((r) =>
        r.data.contents.map((z) => ({
          type: "text",
          text: toMarkdownLinkSmart(z.uri, z.text as string, z.mimeType),
        }))
      ),
      { type: "text", text: content },
    ];

    await append(
      {
        id: crypto.randomUUID(),
        role: "user",
        parts,
      },
      {
        body: {
          model: model,
          tools: Object.values(tools).flat(),
        },
      }
    );
    // SAVE USER MESSAGE TO LOCALSTORE HERE
    clearResourceResults();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessageList />
      <div style={{ padding: 12, borderTop: "1px solid #eee" }}>
        {pending && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <Spinner size="sm" />
          </div>
        )}
        <MessageInput model={model} onSend={handleSend} disabled={pending} />
      </div>
    </div>
  );
};

const toMarkdownLinkSmart = (
  uri: string,
  text: string,
  mimeType: string = "text/plain"
): string => {
  if (mimeType === "application/json") {
    try {
      const pretty = JSON.stringify(JSON.parse(text), null, 2);
      return `[${uri}](${uri})\n\n\`\`\`json\n${pretty}\n\`\`\``;
    } catch {
      // Fall through to plain text if not valid JSON
    }
  }
  if (mimeType === "text/markdown") {
    // Just return as Markdown (no code block)
    return `[${uri}](${uri})\n\n${text}`;
  }
  if (mimeType.startsWith("text/") || mimeType === "text/plain") {
    // Return as plain text (no code block)
    return `[${uri}](${uri})\n\n${text}`;
  }
  if (mimeType === "application/xml" || mimeType === "text/xml") {
    return `[${uri}](${uri})\n\n\`\`\`xml\n${text}\n\`\`\``;
  }
  // Fallback: code block with generic highlighting
  return `[${uri}](${uri})\n\n\`\`\`\n${text}\n\`\`\``;
};
