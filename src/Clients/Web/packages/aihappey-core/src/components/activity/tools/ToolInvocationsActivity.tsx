import React from "react";
import { useToolInvocations } from "./useToolInvocations";
import { ToolInvocationCard } from "./ToolInvocationCard";
import { ToolResultTextCard } from "./ToolResultTextCard";
import { ToolResultResourceCard } from "./ToolResultResourceCard";
import { ToolResultImageCard } from "./ToolResultImageCard";
import { ToolResultAudioCard } from "./ToolResultAudioCard";

/**
 * Renders a list of all tool invocation activities in the current conversation as cards.
 */
export const ToolInvocationsActivity: React.FC = () => {
  const invocations = useToolInvocations();

  if (!invocations.length) {
    return (
      <div style={{ padding: 16, color: "#888" }}>
        No tool invocations found in this conversation.
      </div>
    );
  }
  invocations.reverse();
  return (
    <div
      style={{ padding: 8, display: "flex", flexDirection: "column", gap: 12 }}
    >
      {invocations.flatMap((inv, i) => {
        const cards: React.ReactNode[] = [
          <ToolInvocationCard
            key={(inv.toolCallId || inv.msgId || i) + "-inv"}
            invocation={inv}
          />,
        ];

        if (inv.result?.content && Array.isArray(inv.result.content)) {
          inv.result.content.forEach((c: any, idx: number) => {
            if (c.type === "resource") {
              cards.push(
                <ToolResultResourceCard
                  key={(inv.toolCallId || inv.msgId || i) + "-res-" + idx}
                  invocation={inv}
                  item={c}
                  isError={inv.result.isError}
                />
              );
            } else if (c.type === "text") {
              cards.push(
                <ToolResultTextCard
                  key={(inv.toolCallId || inv.msgId || i) + "-txt-" + idx}
                  invocation={inv}
                  item={c}
                  isError={inv.result.isError}
                />
              );
            } else if (c.type === "image") {
              cards.push(
                <ToolResultImageCard
                  key={(inv.toolCallId || inv.msgId || i) + "-img-" + idx}
                  invocation={inv}
                  item={c}
                  isError={inv.result.isError}
                />
              );
            } else if (c.type === "audio") {
              cards.push(
                <ToolResultAudioCard
                  key={(inv.toolCallId || inv.msgId || i) + "-audio-" + idx}
                  invocation={inv}
                  item={c}
                  isError={inv.result.isError}
                />
              );
            }
          });
        }

        return cards;
      })}
    </div>
  );
};
