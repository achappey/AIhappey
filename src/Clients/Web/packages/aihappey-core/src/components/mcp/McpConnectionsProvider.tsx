import { ReactNode, useEffect } from "react";
import { useAppStore } from "aihappey-state";
import { acquireAccessToken } from "aihappey-auth";
import { LoggingMessageNotification, ProgressNotification } from "aihappey-mcp";

type McpConnectionsProviderProps = {
  children: ReactNode;
  samplingApi?: string;
};

/**
 * McpConnectionsProvider - Ensures all selected MCP servers are connected.
 * Place this high in the component tree (e.g. in CoreRoot).
 * Uses zustand store for state and actions.
 */
export const McpConnectionsProvider = ({
  children,
  samplingApi,
}: McpConnectionsProviderProps) => {
  const servers = useAppStore((s) => s.servers);
  const selected = useAppStore((s) => s.selected);
  const connect = useAppStore((s) => s.connect);
  const addNotification = useAppStore((s) => s.addNotification);
  const addProgress = useAppStore((s) => s.addProgress);
  const addSamplingRequest = useAppStore((s) => s.addSamplingRequest);
  const addSamplingResponse = useAppStore((s) => s.addSamplingResponse);

  useEffect(() => {
    const urls = selected.map((n) => servers[n]?.url).filter(Boolean);

    // Only create the callback once per render
    const onSample = samplingApi
      ? async (params: any) => {
          const id = crypto.randomUUID();
          addSamplingRequest(id, params);
          const accessToken = await acquireAccessToken();

          const res = await fetch(samplingApi, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(params),
          });
          if (!res.ok) {
            throw new Error(`Sampling failed (${res.status})`);
          }
          const json = await res.json();

          // 3. Add response to store
          addSamplingResponse(id, json);

          // (optional) Return as usual
          return json;
        }
      : undefined;

    const onLogging = async (notif: LoggingMessageNotification) =>
      addNotification(notif);

    const onProgress = async (notif: ProgressNotification) =>
      addProgress(notif);

    const connectServers = async () => {
      await Promise.all(
        urls.map((url) => connect(url, { onSample, onLogging, onProgress }))
      );
    };

    connectServers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selected), JSON.stringify(servers), samplingApi]);

  return <>{children}</>;
};
