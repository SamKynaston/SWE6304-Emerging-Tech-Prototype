import type { RefObject } from "react";

export type WebSocketConnectionStatus =
  | "Connecting"
  | "Connected"
  | "Connection error"
  | "Disconnected"
  | "WebSocket URL is not configured";

export interface WebSocketResponse {
  text?: string;
  error?: string;
  sentAt?: string;
}

interface WebSocketSetupOptions {
  onConnectionStatusChange: (status: WebSocketConnectionStatus) => void;
  onMessage: (message: WebSocketResponse) => void;
}

export const getWebSocketUrl = (endPoint: string): string | null => {
  const apiUrl = import.meta.env.VITE_API_URL?.trim() || window.location.origin;

  try {
    const url = new URL(apiUrl, window.location.href);
    const normalizedEndpoint = endPoint.replace(/^\/+|\/+$/g, "");

    url.pathname = `${url.pathname.replace(/\/+$/, "")}/${normalizedEndpoint}/ws`;
    url.search = "";
    url.hash = "";
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.toString();
  } catch {
    return null;
  }
};

export const websocketSetup = (endPoint: string, socket: RefObject<WebSocket | null>, options: WebSocketSetupOptions): (() => void) | undefined => {
  const url = getWebSocketUrl(endPoint);
  
  if (!url) {
    options.onConnectionStatusChange("WebSocket URL is not configured");
    return undefined;
  }

  const ws = new WebSocket(url);
  socket.current = ws;
  options.onConnectionStatusChange("Connecting");

  ws.onopen = () => options.onConnectionStatusChange("Connected");
  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(String(event.data)) as WebSocketResponse;
      options.onMessage(message);
    } catch {
      options.onMessage({ error: "Received an invalid response from the server." });
    }
  };
  ws.onerror = () => options.onConnectionStatusChange("Connection error");
  ws.onclose = () => options.onConnectionStatusChange("Disconnected");

  return () => {
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;

    if (socket.current === ws) {
      socket.current = null;
    }
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
};

export const sendWebSocketMessage = (
  socket: RefObject<WebSocket | null>,
  text: string,
): boolean => {
  const ws = socket.current;
  const message = text.trim();
  if (!message || ws?.readyState !== WebSocket.OPEN) return false;

  ws.send(JSON.stringify({ text: message }));
  return true;
};