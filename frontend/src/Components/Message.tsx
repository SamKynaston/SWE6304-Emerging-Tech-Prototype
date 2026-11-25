import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@prototype/types";
import {sendWebSocketMessage, websocketSetup, type WebSocketConnectionStatus, type WebSocketResponse} from "../Utilities/Websocket.utilities";

export const Message = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>("Connecting");
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        return websocketSetup("v1/chat", socket, {
            onConnectionStatusChange: setConnectionStatus,
            onMessage: (message: WebSocketResponse) => {
                const content = message.text ?? (message.error ? `Error: ${message.error}` : null);
                if (content) {
                    setMessages((current) => [
                        ...current,
                        {
                            id: crypto.randomUUID(),
                            role: message.error ? "system" : "assistant",
                            text: content,
                            sentByClient: false,
                        },
                    ]);
                }
            },
        });
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = text.trim();
        if (!message) return;

        if (sendWebSocketMessage(socket, message)) {
            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "user",
                    text: message,
                    sentByClient: true,
                },
            ]);
            setText("");
        }
    };

    return (
        <section className="rounded-xl border">
            <ul aria-live="polite" className="flex flex-col gap-4 p-4 text-left">
                {messages.map((message) => (
                    <li key={message.id} className={`flex ${message.sentByClient ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-2 ${
                            message.sentByClient
                                ? "bg-blue-600 text-white"
                                : message.role === "system"
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-stone-700 text-white"
                        }`}>
                            <p className="mb-1 text-xs font-semibold">
                                {message.sentByClient
                                    ? "You"
                                    : message.role === "system"
                                      ? "Notice"
                                      : "Assistant"}
                            </p>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.text}
                            </ReactMarkdown>
                        </div>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 stone bg-stone-900 rounded-b-xl p-2">
                <input className="col-span-2" value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message" required disabled={connectionStatus !== "Connected"}/>
                <button type="submit" disabled={connectionStatus !== "Connected"}>Send</button>
            </form>
        </section>
    );
};
