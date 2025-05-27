import { useState, useMemo } from "react";
import { useAppStore } from "aihappey-state";
import { useTheme } from "../../ThemeContext";

type Resource = {
  name: string;
  description?: string;
  uri: string;
  serverUrl?: string;
};

type ResourceSelectButtonProps = {};

export const ResourceSelectButton = ({}: ResourceSelectButtonProps) => {
  const { Button } = useTheme();
  const selected = useAppStore((s) => s.selected);
  const servers = useAppStore((s: any) => s.servers || {});
  const resources = useAppStore((s: any) => s.resources);
  const readResource = useAppStore((s) => s.readResource);

  // Map selected server names to URLs, then flatten resources by URL
  const allResources: Resource[] = useMemo(
    () =>
      selected.flatMap((name: string) => {
        const url = servers[name]?.url;
        return url && Array.isArray(resources[url])
          ? resources[url].map((r: Resource) => ({ ...r, serverUrl: url }))
          : [];
      }),
    [selected, servers, resources]
  );

  const [open, setOpen] = useState(false);

  if (allResources.length === 0) return null;

  return (
    <>
      <Button
        type="button"
        icon="resources"
        onClick={() => setOpen(true)}
        title="Insert Resource"
      ></Button>
      {open && (
        <ResourceSelectModal
          resources={allResources}
          onSelect={async (uri) => {
            setOpen(false);
            await readResource(uri);
          }}
          onHide={() => setOpen(false)}
        />
      )}
    </>
  );
};

type ResourceSelectModalProps = {
  resources: Resource[];
  onSelect: (uri: string) => void;
  onHide: () => void;
};

const ResourceSelectModal = ({
  resources,
  onSelect,
  onHide,
}: ResourceSelectModalProps) => {
  const { Modal, Button } = useTheme();

  return (
    <Modal show={true} onHide={onHide} title="Select Resource">
      <div
        style={{
          minWidth: 320,
          maxHeight: 400,
          overflowY: "auto",
          marginBottom: 16,
        }}
      >
        {resources.length === 0 && (
          <div style={{ color: "#888" }}>No resources available.</div>
        )}
        {resources.map((resource, idx) => (
          <div
            key={resource.name + idx}
            style={{
              border: "1px solid #eee",
              borderRadius: 6,
              padding: 8,
              marginBottom: 8,
              cursor: "pointer",
            }}
            onClick={() => onSelect(resource.uri)}
            title={resource.description || resource.uri}
          >
            <div style={{ fontWeight: 500 }}>{resource.name}</div>
            {resource.description && (
              <div style={{ color: "#888", fontSize: 13 }}>
                {resource.description}
              </div>
            )}
            <div
              style={{
                color: "#444",
                fontSize: 13,
                marginTop: 4,
                wordBreak: "break-all",
              }}
            >
              {resource.uri}
            </div>
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
