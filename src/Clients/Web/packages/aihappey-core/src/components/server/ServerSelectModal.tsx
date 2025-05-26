import { useState } from "react";
import { useAppStore } from "aihappey-state";
import { useTheme } from "../../ThemeContext";

type Props = {
  show: boolean;
  onHide: () => void;
};

export const ServerSelectModal = ({ show, onHide }: Props) => {
  const { Modal, Button } = useTheme();
  const servers: any = useAppStore((s) => s.servers);
  const selected = useAppStore((s) => s.selected);
  const selectServers = useAppStore((s) => s.selectServers);

  const [checked, setChecked] = useState<Set<string>>(new Set(selected));

  const handleToggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleOk = () => {
    selectServers(Array.from(checked));
    onHide();
  };

  const handleCancel = () => {
    setChecked(new Set(selected));
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} title="Select MCP Servers">
      <div
        style={{
          minWidth: 320,
          maxHeight: 400,
          overflowY: "auto",
          marginBottom: 16,
        }}
      >
        {Object.entries(servers).length === 0 && (
          <div style={{ color: "#888" }}>No servers available.</div>
        )}
        {Object.entries(servers).map(([name, cfg]) => (
          <label
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <input
              type="checkbox"
              checked={checked.has(name)}
              onChange={() => handleToggle(name)}
            />
            <span>{name}</span>
            <span style={{ color: "#888", fontSize: 12 }}>
              {(cfg as any)?.url}
            </span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={handleCancel} type="button" style={{ minWidth: 80 }}>
          Cancel
        </Button>
        <Button onClick={handleOk} type="button" style={{ minWidth: 80 }}>
          OK
        </Button>
      </div>
    </Modal>
  );
};
