import React from "react";
import { useTheme } from "../../ThemeContext";

export interface ShowJsonModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  json: any;
}

export const ShowJsonModal: React.FC<ShowJsonModalProps> = ({ open, onClose, title, json }) => {
  const theme = useTheme();
  const jsonString = typeof json === "string" ? json : JSON.stringify(json, null, 2);

  if (!open) return null;

  const content = theme.TextArea
    ? theme.TextArea({ value: jsonString, readOnly: true, style: { width: "100%", minHeight: 180 } })
    : (
      <textarea
        value={jsonString}
        readOnly
        style={{ width: "100%", minHeight: 180, fontFamily: "monospace", fontSize: 13 }}
      />
    );

  return theme.Modal
    ? theme.Modal({
        show: open,
        onHide: onClose,
        title,
        children: (
          <div>
            {content}
            <div style={{ marginTop: 16, textAlign: "right" }}>
              {theme.Button
                ? theme.Button({ children: "Close", onClick: onClose, size: "sm" })
                : <button onClick={onClose}>Close</button>
              }
            </div>
          </div>
        ),
      })
    : (
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            minWidth: 320,
            maxWidth: 520,
            padding: 24,
            boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{title}</div>
          {content}
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
};
