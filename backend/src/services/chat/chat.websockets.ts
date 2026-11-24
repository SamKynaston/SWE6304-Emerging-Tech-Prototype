import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { CHAT_MESSAGE } from "./chat.controller";

export function REGISTER_WEBSOCKET_ROUTES(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/v1/chat/ws" });

  wss.on("connection", (socket) => {
    socket.on("message", (raw) => {
        CHAT_MESSAGE(socket, raw)
    });
  });
}