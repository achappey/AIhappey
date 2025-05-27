import { useState, useMemo } from "react";
import { useAppStore } from "aihappey-state";
import { useTheme } from "../../ThemeContext";

import type { Prompt } from "@modelcontextprotocol/sdk/types.js";
import { PromptArgumentsModal } from "./PromptArgumentsModal";

type PromptWithSource = Prompt & { _url: string; text?: string };

type PromptSelectButtonProps = {
  model?: string;
};

export const PromptSelectButton = ({ model }: PromptSelectButtonProps) => {
  const { Button } = useTheme();
  const selected = useAppStore((s) => s.selected);
  const servers = useAppStore((s: any) => s.servers || {});
  const prompts = useAppStore((s: any) => s.prompts);

  // Map selected server names to URLs, then flatten prompts by URL
  const allPrompts: PromptWithSource[] = useMemo(
    () =>
      selected.flatMap((name: string) => {
        const url = servers[name]?.url;
        return url && Array.isArray(prompts[url])
          ? prompts[url].map((p: any) => ({ ...p, _url: url }))
          : [];
      }),
    [selected, servers, prompts]
  );

  const [open, setOpen] = useState(false);
  const [argumentPrompt, setArgumentPrompt] = useState<PromptWithSource | null>(
    null
  );

  if (allPrompts.length === 0) return null;

  return (
    <>
      <Button
        type="button"
        icon="prompts"
        onClick={() => setOpen(true)}
        title="Insert Prompt"
      ></Button>

      {open && (
        <PromptSelectModal
          prompts={allPrompts}
          onPromptClick={(p) => {
            if (p.arguments && p.arguments.length > 0) {
              setArgumentPrompt(p);
            }
            setOpen(false);
          }}
          onHide={() => setOpen(false)}
        />
      )}

      {argumentPrompt && (
        <PromptArgumentsModal
          prompt={argumentPrompt}
          model={model}
          onHide={() => setArgumentPrompt(null)}
        />
      )}
    </>
  );
};

type PromptSelectModalProps = {
  prompts: PromptWithSource[];
  onPromptClick: (p: PromptWithSource) => void;
  onHide: () => void;
};

const PromptSelectModal = ({
  prompts,
  onPromptClick,
  onHide,
}: PromptSelectModalProps) => {
  const { Modal, Button } = useTheme();

  return (
    <Modal show={true} onHide={onHide} title="Select Prompt">
      <div
        style={{
          minWidth: 320,
          maxHeight: 400,
          overflowY: "auto",
          marginBottom: 16,
        }}
      >
        {prompts.length === 0 && (
          <div style={{ color: "#888" }}>No prompts available.</div>
        )}
        {prompts.map((prompt, idx) => (
          <div
            key={prompt.name + idx}
            style={{
              border: "1px solid #eee",
              borderRadius: 6,
              padding: 8,
              marginBottom: 8,
              cursor: "pointer",
            }}
            onClick={() => onPromptClick(prompt as PromptWithSource)}
            title={prompt.description || prompt.text || prompt.name}
          >
            <div style={{ fontWeight: 500 }}>{prompt.name}</div>
            {prompt.description && (
              <div style={{ color: "#888", fontSize: 13 }}>
                {prompt.description}
              </div>
            )}
            {prompt.text && (
              <div
                style={{
                  color: "#444",
                  fontSize: 13,
                  marginTop: 4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {prompt.text}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onHide} type="button" style={{ minWidth: 80 }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
