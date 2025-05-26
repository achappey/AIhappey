import React, { useEffect } from "react";
import { ModelSelect } from "./ModelSelect";
import { useChatContext } from "../chat/ChatContext";
import { useModels } from "../chat/useModels";
import { useUi } from "aihappey-state";
import { useTheme } from "../../ThemeContext";

interface ChatHeaderProps {
  value?: string;
  onChange: (id: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ value, onChange }) => {
  const { config } = useChatContext();
  const { models, loading } = useModels(
    config.modelsApi!,
    config.getAccessToken
  );
  const { toggleActivities, showActivities } = useUi();
  const { Switch } = useTheme();

  useEffect(() => {
    if (!loading && models.length && !value) {
      onChange(models[0].id);
    }
  }, [loading, models, value, onChange]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: 48,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "0 12px",
        gap: 16,
      }}
    >
      <ModelSelect
        models={models}
        value={value ?? ""}
        onChange={onChange}
        disabled={loading}
      />
      <div style={{ flex: 1 }} />
      <Switch
        onChange={toggleActivities}
        label="Show Activities"
        id={""}
        checked={showActivities}
      ></Switch>
    </div>
  );
};
