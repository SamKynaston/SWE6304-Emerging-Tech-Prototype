import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { CHAT_MESSAGE, type ChatConversationContext } from "./chat.controller";

export function REGISTER_WEBSOCKET_ROUTES(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/v1/chat/ws" });

  wss.on("connection", (socket) => {
    const conversation: ChatConversationContext = {};
    let messageQueue: Promise<void> = Promise.resolve();

    socket.on("message", (raw) => {
      messageQueue = messageQueue
        .then(() => CHAT_MESSAGE(socket, raw, conversation))
        .catch((error: unknown) => {
          console.error("Failed to process queued chat message:", error);
        });
    });
  });
}