import { Router } from "express";
import { WebSocket, WebSocketServer } from "ws";
import { initialiseService } from "../../utils/start.service";
import { sequelize } from "../../utils/start.database";
import chatRoutes from "./chat.routes";
import { SEND_REQUEST_TO_MODEL_DEMO } from "../../middleware/models.middleware";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/chat", chatRoutes)

    await initialiseService("/v1", combinedRoutes, (server) => {
        const wss = new WebSocketServer({ server, path: "/v1/chat/ws" });

        wss.on("connection", (socket) => {
            socket.on("message", async (raw) => {
                let message: unknown;

                try {
                    message = JSON.parse(raw.toString());
                } catch {
                    socket.send(JSON.stringify({ error: "Send valid JSON with a text field." }));
                    return;
                }

                if (
                    typeof message !== "object" ||
                    message === null ||
                    !("text" in message) ||
                    typeof message.text !== "string" ||
                    !message.text.trim()
                ) {
                    socket.send(JSON.stringify({ error: "A non-empty text field is required." }));
                    return;
                }

                try {
                    const text = await SEND_REQUEST_TO_MODEL_DEMO(message.text);
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            text,
                            sentAt: new Date().toISOString(),
                        }));
                    }
                } catch (error) {
                    console.error("Failed to generate chat response:", error);
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ error: "Could not generate a response." }));
                    }
                }
            });
        })
    })
}

start()