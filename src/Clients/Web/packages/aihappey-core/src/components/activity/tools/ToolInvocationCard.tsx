import React, { useState } from "react";
import { useTheme } from "../../../ThemeContext";
import { ShowJsonModal } from "../ShowJsonModal";

export interface ToolInvocationCardProps {
  invocation: {
    toolName: string;
    args?: string;
    role: string;
    step?: number;
    state?: string;
    toolCallId?: string;
  };
}

export const ToolInvocationCard: React.FC<ToolInvocationCardProps> = ({
  invocation,
}) => {
  const theme = useTheme();
  const [showArgs, setShowArgs] = useState(false);

  let argsObj: any = {};
  try {
    argsObj = invocation.args ? JSON.parse(invocation.args) : {};
  } catch {
    argsObj = invocation.args || {};
  }
  const argsPreview = JSON.stringify(argsObj, null, 2);
  const truncatedArgs =
    argsPreview.length > 120 ? argsPreview.slice(0, 120) + "..." : argsPreview;

  return theme.Card({
    title: invocation.toolName,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <pre
            style={{
              maxWidth: 340,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              margin: 0,
              fontSize: 13,
            }}
          >
            {truncatedArgs}
          </pre>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          {argsPreview.length > 120 &&
            (theme.Button ? (
              theme.Button({
                size: "sm",
                children: "View raw",
                onClick: () => setShowArgs(true),
              })
            ) : (
              <button
                style={{ fontSize: 12 }}
                onClick={() => setShowArgs(true)}
              >
                View raw
              </button>
            ))}
        </div>
        {showArgs && (
          <ShowJsonModal
            open={showArgs}
            onClose={() => setShowArgs(false)}
            title="Tool Arguments"
            json={argsObj}
          />
        )}
      </div>
    ),
  });
};
