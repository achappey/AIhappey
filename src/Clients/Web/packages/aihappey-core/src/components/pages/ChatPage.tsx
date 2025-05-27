import { useState } from "react";
import { ConversationSidebar } from "../chat/ConversationSidebar";
import { ChatPanel } from "../chat/ChatPanel";
import { ChatHeader } from "../chat/ChatHeader";
import { useTheme } from "../../ThemeContext";
import { useUi } from "aihappey-state";
import { ToolInvocationsActivity } from "../activity/tools/ToolInvocationsActivity";
import { LoggingNotificationsActivity } from "../activity/logging/LoggingNotificationsActivity";
import { ProgressNotificationsActivity } from "../activity/progress/ProgressNotificationsActivity";
import { SamplingActivity } from "../activity/sampling/SamplingActivity";

export const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    "gpt-4.1"
  );
  const [activeTab, setActiveTab] = useState("toolInvocations");
  const theme = useTheme();
  const { showActivities, setActivities } = useUi();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 260,
          minWidth: 180,
          maxWidth: 320,
          borderRight: "1px solid #ddd",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ConversationSidebar />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatHeader value={selectedModel} onChange={setSelectedModel} />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatPanel model={selectedModel} />
        </div>
      </div>
      {theme.Drawer &&
        theme.Drawer({
          open: showActivities,
          onClose: () => setActivities(false),
          title: "Activities",
          size: "medium",
          children: (
            <theme.Tabs activeKey={activeTab} onSelect={setActiveTab}>
              <theme.Tab eventKey="toolInvocations" title="Tools">
                <ToolInvocationsActivity />
              </theme.Tab>
              <theme.Tab eventKey="mcpProgress" title="Progress">
                <ProgressNotificationsActivity />
              </theme.Tab>
              <theme.Tab eventKey="mcpSampling" title="Sampling">
                <SamplingActivity />
              </theme.Tab>
              <theme.Tab eventKey="mcpLogging" title="Log">
                <LoggingNotificationsActivity />
              </theme.Tab>
            </theme.Tabs>
          ),
        })}
    </div>
  );
};
