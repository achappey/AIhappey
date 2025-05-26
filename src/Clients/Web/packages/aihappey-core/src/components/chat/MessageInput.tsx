import { useState, useRef } from "react";
import { useTheme } from "../../ThemeContext";
import { PromptSelectButton } from "../prompt/PromptSelectButton";
import { ResourceSelectButton } from "../resource/ResourceSelectButton";
import { useAppStore } from "aihappey-state";
import { ServerSelectButton } from "../server/ServerSelectButton";

export const MessageInput = ({
  onSend,
  disabled,
  model,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
  model?: string;
}) => {
  const { Input, Button } = useTheme();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLInputElement>(null);

  // Resource badge state
  const resourceResults = useAppStore((s) => s.resourceResults);
  const removeResourceResult = useAppStore((s) => s.removeResourceResult);

  const resources = useAppStore((s: any) => s.resources);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    // Auto-grow
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSend(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Insert text at cursor or append if not focused
  const insertText = (text: string) => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      const input = textareaRef.current;
      const start = input.selectionStart ?? value.length;
      const end = input.selectionEnd ?? value.length;
      const newValue = value.slice(0, start) + text + value.slice(end);
      setValue(newValue);
      // Move cursor after inserted text
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + text.length;
        input.focus();
      }, 0);
    } else {
      setValue((v) => (v ? v + " " + text : text));
    }
  };

  // Helper to get resource name from uri
  function getResourceName(uri: string): string {
    for (const url of Object.keys(resources)) {
      const found = (resources[url] || []).find((r: any) => r.uri === uri);
      if (found) return found.name;
    }
    return uri;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        flexDirection: "column",
      }}
    >
      {resourceResults.length > 0 && (
        <div
          style={{ display: "flex", gap: 8, marginBottom: 4, width: "100%" }}
        >
          {resourceResults.map((r) => (
            <div
              key={r.uri}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#e6f0fa",
                borderRadius: 12,
                padding: "2px 10px",
                fontSize: 13,
                border: "1px solid #b3d1f7",
                color: "#1a3a5d",
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={r.uri}
            >
              {getResourceName(r.uri)}
              <span
                style={{
                  marginLeft: 8,
                  cursor: "pointer",
                  color: "#888",
                  fontWeight: "bold",
                  fontSize: 15,
                  lineHeight: 1,
                }}
                onClick={() => removeResourceResult(r.uri)}
                title="Remove"
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <ServerSelectButton />
        <PromptSelectButton model={model} />
        <ResourceSelectButton />
        <Input
          //as="textarea"
          ref={textareaRef}
          //        rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          disabled={disabled}
          style={{ resize: "none", minHeight: 38, maxHeight: 120, flex: 1 }}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          icon="send"
        ></Button>
      </div>
    </form>
  );
};
