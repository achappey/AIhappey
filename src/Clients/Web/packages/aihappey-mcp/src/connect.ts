import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import {
  CreateMessageRequest, CreateMessageRequestSchema,
  CreateMessageResult, CreateMessageResultSchema, LoggingMessageNotification, LoggingMessageNotificationSchema, NotificationSchema, ProgressNotification, ProgressNotificationSchema, type Prompt, type Resource, type ServerCapabilities, type Tool
} from "@modelcontextprotocol/sdk/types.js";
import { getMcpAccessToken, initiateMcpOAuthFlow } from "aihappey-auth";

import { z } from "zod";

export type SamplingCallback = (
  params: z.infer<typeof CreateMessageRequestSchema>["params"],
  accessToken: string
) => Promise<z.infer<typeof CreateMessageResultSchema>>;

export type McpConnectResult = {
  client: InstanceType<typeof Client>;
  capabilities: ServerCapabilities | null;
  tools?: Tool[];
  prompts?: Prompt[];
  resources?: Resource[];
};

/**
 * Utility to detect if an error/response indicates OAuth is required.
 * Checks for HTTP 401, WWW-Authenticate header, or { error: "oauth_required" } shape.
 */
const needsOAuth = (err: any): boolean => {
  if (!err) return false;
  if (err.toString() == "Error: Error POSTing to endpoint (HTTP 401): Invalid or missing token") return true;
  if (err.toString() == "Error: SSE error: Non-200 status code (401)") return true;
  // Check for HTTP 401 or 403
  if (err.status === 401 || err.status === 403) return true;
  // Check for error shape
  if (typeof err === "object" && (err.error === "oauth_required" || err.code === "oauth_required")) return true;
  // Check for WWW-Authenticate header
  if (err.headers && typeof err.headers.get === "function") {
    const www = err.headers.get("WWW-Authenticate");
    if (www && www.includes("Bearer")) return true;
  }
  return false;
}

export async function connectMcpServer(
  url: string,
  opts?: {
    token?: string;
    headers?: Record<string, string>;
    onSample?: (req: CreateMessageRequest) => Promise<CreateMessageResult>;
    onLogging?: (req: LoggingMessageNotification) => Promise<void>;
    onProgress?: (req: ProgressNotification) => Promise<void>;
  }
): Promise<McpConnectResult> {
  const headers: Record<string, string> = { ...opts?.headers };
  let token = opts?.token || getMcpAccessToken(url);

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const client = new Client({
    name: "web-client",
    version: "1.0.0",
    headers,
  }, {
    capabilities: {
      sampling: opts?.onSample ? {} : undefined,
    }
  });

  const baseUrl = new URL(url);
  const transport = new StreamableHTTPClientTransport(baseUrl, {
    requestInit: { headers },
  });

  if (opts?.onSample) {
    client.setRequestHandler(
      CreateMessageRequestSchema,
      async ({ params }) => await opts.onSample!(params as any));
  }

  if (opts?.onLogging) {
    client.setNotificationHandler(LoggingMessageNotificationSchema, async ({ params }) => await opts?.onLogging!(params as any));
  }

  if (opts?.onProgress) {
    client.setNotificationHandler(ProgressNotificationSchema, async ({ params }) => await opts?.onProgress!(params as any));
  }

  try {
    await client.connect(transport);
  } catch (err: any) {
    if (needsOAuth(err)) {
      // No valid token, or token expired/invalid: start OAuth flow
      await initiateMcpOAuthFlow(url);
      // This will redirect, so function never returns
      throw new Error("Redirecting for OAuth");
    }
    throw err;
  }


  const capabilities = client.getServerCapabilities?.() ?? null;
  let tools: any[] | undefined = undefined;
  if (capabilities?.tools) {
    const res = await client.listTools();
    tools = res.tools;
  }

  let resources: Resource[] | undefined = undefined;
  if (capabilities?.resources) {
    const res = await client.listResources();
    resources = res.resources;
  }

  let prompts: any[] | undefined = undefined;
  if (capabilities?.prompts) {
    const res = await client.listPrompts();
    prompts = res.prompts;
  }

  return { client, capabilities, tools, prompts, resources };
}
