// Express
import { Request, Response } from "express";
import { WebSocket } from "ws";
import { SEND_REQUEST_TO_MODEL_DEMO } from "../../middleware/models.middleware";
import { RawData } from "ws";

export const TEST_ROUTE = async ( Req: Request, Res: Response ) => {
    try {
        return Res.status(200).json({ success: true })
    } catch {
        return Res.status(500).json({ success: false })
    }
}

export const CHAT_MESSAGE = async (socket: WebSocket, message: RawData) => {
    try {
        message = JSON.parse(message.toString());
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
}