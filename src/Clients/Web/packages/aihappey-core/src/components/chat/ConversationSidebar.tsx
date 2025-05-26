import { useState } from "react";
import { useConversations } from "../chat/useConversations";
import { useTheme } from "../../ThemeContext";
import { useChatStore } from "../chat";

export const ConversationSidebar = () => {
  const {
    conversations,
    selectedConversationId,
    createConversation,
    removeConversation,
    selectConversation,
  } = useConversations();
  const { Button, Input } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditSubmit = (id: string) => {
    if (editValue.trim()) {
      //   updateChat(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: 8,
          borderBottom: "1px solid #444",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Conversations</span>
        <Button
          size="sm"
          icon="add"
          onClick={() => createConversation("New chat")}
        ></Button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              background:
                conv.id === selectedConversationId ? "#e6f0ff" : undefined,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => selectConversation(conv.id)}
          >
            {editingId === conv.id ? (
              <Input
                value={editValue}
                autoFocus
                onChange={(e: any) => setEditValue(e.target.value)}
                onBlur={() => handleEditSubmit(conv.id)}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") handleEditSubmit(conv.id);
                }}
                style={{ maxWidth: 120 }}
              />
            ) : (
              <>
                <span
                  style={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conv.name}
                </span>
                <span>
                  <Button
                    size="sm"
                    variant="subtle"
                    icon="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(conv.id, conv.name);
                    }}
                  >
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeConversation(conv.id);
                    }}
                  >
                  </Button>
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
