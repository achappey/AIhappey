import React, { useState } from "react";
import { useTheme } from "../../../ThemeContext";
import { ShowJsonModal } from "../ShowJsonModal";

export interface ToolResultTextCardProps {
  invocation: {
    toolName: string;
    toolCallId?: string;
  };
  item: {
    type: "text";
    text: string;
  };
  isError?: boolean;
}

export const ToolResultTextCard: React.FC<ToolResultTextCardProps> = ({
  invocation,
  item,
  isError,
}) => {
  const theme = useTheme();
  const [showText, setShowText] = useState(false);

  const preview =
    item.text.length > 120 ? item.text.slice(0, 120) + "..." : item.text;

  return theme.Card({
    title: "",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <b>{invocation.toolName}</b>
          {theme.Badge ? (
            theme.Badge({
              children: "text result",
            })
          ) : (
            <span
              style={{
                background: isError ? "#f8d7da" : "#d1e7dd",
                color: isError ? "#842029" : "#0f5132",
                borderRadius: 4,
                padding: "0 6px",
                fontSize: 12,
              }}
            >
              text result
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>
            Result (preview):
          </div>
          <pre
            style={{
              maxWidth: 340,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              margin: 0,
              fontSize: 13,
            }}
          >
            {preview}
          </pre>
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}
        >
          {item.text.length > 0 &&
            (theme.Button ? (
              theme.Button({
                size: "sm",
                children: "Show full text",
                onClick: () => setShowText(true),
              })
            ) : (
              <button
                style={{ fontSize: 12 }}
                onClick={() => setShowText(true)}
              >
                Show full text
              </button>
            ))}
        </div>
        {showText && (
          <ShowJsonModal
            open={showText}
            onClose={() => setShowText(false)}
            title="Tool Result Text"
            json={item.text}
          />
        )}
      </div>
    ),
  });
};
