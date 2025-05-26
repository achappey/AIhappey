import type { StateCreator } from "zustand";
import { connectMcpServer, McpConnectResult, CreateMessageRequest, CreateMessageResult } from "aihappey-mcp";
import { type CallToolResult, type ReadResourceResult, type ServerCapabilities, type LoggingMessageNotification, ProgressTokenSchema } from "@modelcontextprotocol/sdk/types.js";

type McpStatus = "idle" | "connecting" | "connected" | "error";


type Tool = {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
};

import type { ProgressNotification, Prompt, Resource } from "@modelcontextprotocol/sdk/types.js";

export type ResourceResult = { uri: string; data: ReadResourceResult };


type McpConnectOpts = {
  token?: string;
  headers?: Record<string, string>;
  onSample?: (req: CreateMessageRequest) => Promise<CreateMessageResult>;
  onLogging?: (notif: LoggingMessageNotification) => Promise<void>;
  onProgress?: (notif: ProgressNotification) => Promise<void>;
};

export type SamplingRequest = [any, any];

export type McpSlice = {
  clients: Record<string, McpConnectResult["client"]>;
  status: Record<string, McpStatus>;
  errors: Record<string, string | null>;
  capabilities: Record<string, ServerCapabilities | null>;
  tools: Record<string, Tool[]>;
  prompts: Record<string, Prompt[]>;
  resources: Record<string, Resource[]>;
  resourceResults: ResourceResult[];
  notifications: LoggingMessageNotification[];
  addNotification: (notif: LoggingMessageNotification) => void;
  clearNotifications: () => void;
  progress: ProgressNotification[];
  addProgress: (notif: ProgressNotification) => void;
  clearProgress: () => void;

  sampling: Record<string, SamplingRequest>;
  addSamplingRequest: (id: string, notif: CreateMessageRequest) => void;
  addSamplingResponse: (id: string, notif: CreateMessageResult) => void;
  clearSampling: () => void;

  tokens: Record<string, string>;
  setToken: (url: string, token: string) => void;
  clearToken: (url: string) => void;
  readResource: (uri: string) => Promise<void>;
  callTool: (toolCallId: string, name: string, parameters: any) => Promise<CallToolResult | undefined>;
  removeResourceResult: (uri: string) => void;
  clearResourceResults: () => void;
  connect: (url: string, opts?: McpConnectOpts) => Promise<void>;
  disconnect: (url: string) => void;
  refreshTools: (url: string) => Promise<void>;
  refreshPrompts: (url: string) => Promise<void>;
  refreshResources: (url: string) => Promise<void>;
};

export const createMcpSlice: StateCreator<
  any,
  [],
  [],
  McpSlice
> = (set, get, store) => ({
  clients: {},
  status: {},
  errors: {},
  capabilities: {},
  tools: {},
  prompts: {},
  resources: {},
  resourceResults: [],
  notifications: [],
  sampling: {},
  progress: [],
  addSamplingRequest: (id, notif) =>
    set((state: any) => ({
      sampling: { ...state.sampling, [id]: [notif] }
    })),
  addSamplingResponse: (id, notif) =>
    set((state: any) => ({
      sampling: {
        ...state.sampling,
        [id]: state.sampling[id] ? [state.sampling[id][0], notif] : [undefined, notif]
      }
    })),
  clearSampling: () =>
    set((state: any) => ({
      sampling: {}
    })),
  addNotification: (notif) =>
    set((state: any) => ({
      notifications: [...state.notifications, notif]
    })),
  clearNotifications: () =>
    set((state: any) => {
      return { notifications: [] };
    }),
  addProgress: (notif) =>
    set((state: any) => ({
      progress: [...state.progress, notif]
    })),
  clearProgress: () =>
    set((state: any) => {
      return { progress: [] };
    }),
  tokens: {},
  setToken: (url, token) => {
    set((state: any) => ({
      tokens: { ...state.tokens, [url]: token }
    }));
  },
  clearToken: (url) => {
    set((state: any) => {
      const newTokens = { ...state.tokens };
      delete newTokens[url];
      return { tokens: newTokens };
    });
  },
  readResource: async (uri: string) => {
    // Find the server URL that owns this resource
    const { resources, clients, resourceResults } = get();
    const url = Object.keys(resources).find(url =>
      (resources[url] || []).some((r: Resource) => r.uri === uri)
    );
    if (!url) return;
    const client = clients[url];
    if (!client?.readResource) return;
    // Prevent duplicate
    if (resourceResults.some((r: ResourceResult) => r.uri === uri)) return;
    try {
      const res: ReadResourceResult = await client.readResource({ uri });
      console.log(res)
      set((state: any) => ({
        resourceResults: [...state.resourceResults, { uri, data: res }]
      }));
    } catch (e: any) {
      set((state: any) => ({
        errors: { ...state.errors, [url]: "Failed to read resource: " + (e?.message || String(e)) }
      }));
    }
  },
  callTool: async (toolCallId: string, name: string, parameters: any) => {
    // Find the server URL that owns this resource
    const { resources, clients, tools } = get();
    const url = Object.keys(resources).find(url =>
      (tools[url] || []).some((r: Tool) => r.name === name)
    );
    if (!url) return;
    const client = clients[url];
    if (!client?.callTool) return;

    try {
      const res: CallToolResult = await client.callTool({
        name: name,
        arguments: JSON.parse(parameters),
        resetTimeoutOnProgress: true,
        _meta: {
          progressToken: toolCallId
        }
      });

      return res;
    } catch (e: any) {
      set((state: any) => ({
        errors: { ...state.errors, [url]: "Failed to call tool: " + (e?.message || String(e)) }
      }));
    }
    return undefined;
  },
  removeResourceResult: (uri: string) => {
    set((state: any) => ({
      resourceResults: state.resourceResults.filter((r: ResourceResult) => r.uri !== uri)
    }));
  },
  clearResourceResults: () => {
    set((state: any) => ({
      resourceResults: []
    }));
  },
  connect: async (url, opts) => {
    const { status, tokens } = get();
    if (status[url] === "connecting" || status[url] === "connected") return;
    set((state: any) => ({
      status: { ...state.status, [url]: "connecting" },
      errors: { ...state.errors, [url]: null },
    }));

    try {
      // Prefer token from state if not explicitly passed
      const token = opts?.token ?? tokens[url];
      const connectOpts: McpConnectOpts = {
        ...opts, token,
        onSample: opts?.onSample,
        onLogging: opts?.onLogging,
        onProgress: opts?.onProgress
      };
      const { client, capabilities, tools, prompts, resources } = await connectMcpServer(url, connectOpts);

      set((state: any) => ({
        clients: { ...state.clients, [url]: client },
        status: { ...state.status, [url]: "connected" },
        capabilities: { ...state.capabilities, [url]: capabilities },
        tools: { ...state.tools, [url]: tools ?? [] },
        prompts: { ...state.prompts, [url]: prompts ?? [] },
        resources: { ...state.resources, [url]: resources ?? [] },
      }));
    } catch (err: any) {
      set((state: any) => ({
        status: { ...state.status, [url]: "error" },
        errors: { ...state.errors, [url]: err?.message || String(err) },
      }));
    }
  },
  disconnect: (url) => {
    const { clients } = get();
    if (clients[url]) {
      clients[url].close?.();
      const newClients = { ...clients };
      delete newClients[url];
      set((state: any) => ({
        clients: newClients,
        status: { ...state.status, [url]: "idle" },
        capabilities: { ...state.capabilities, [url]: null },
        tools: { ...state.tools, [url]: [] },
        prompts: { ...state.prompts, [url]: [] },
        resources: { ...state.resources, [url]: [] },
      }));
    }
  },
  refreshTools: async (url) => {
    const { clients } = get();
    const client = clients[url];
    if (!client) return;
    try {
      const res = await client.listTools();
      set((state: any) => ({
        tools: { ...state.tools, [url]: res.tools },
      }));
    } catch (e) {
      set((state: any) => ({
        errors: { ...state.errors, [url]: "Failed to fetch tools" },
      }));
    }
  },
  refreshPrompts: async (url) => {
    const { clients } = get();
    const client = clients[url];
    if (!client) return;
    try {
      const res = await client.listPrompts();
      set((state: any) => ({
        prompts: { ...state.prompts, [url]: res.prompts },
      }));
    } catch (e) {
      set((state: any) => ({
        errors: { ...state.errors, [url]: "Failed to fetch prompts" },
      }));
    }
  },
  refreshResources: async (url) => {
    const { clients } = get();
    const client = clients[url];
    if (!client) return;
    try {
      const res = await client.listResources();
      set((state: any) => ({
        resources: { ...state.resources, [url]: res.resources },
      }));
    } catch (e) {
      set((state: any) => ({
        errors: { ...state.errors, [url]: "Failed to fetch resources" },
      }));
    }
  },
});
