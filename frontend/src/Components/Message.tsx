import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {sendWebSocketMessage, websocketSetup, type WebSocketConnectionStatus, type WebSocketResponse} from "../Utilities/Websocket.utilities";

export const Message = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>("Connecting");
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        return websocketSetup("v1/chat", socket, {
            onConnectionStatusChange: setConnectionStatus,
            onMessage: (message: WebSocketResponse) => {
                const content = message.text ?? (message.error ? `Error: ${message.error}` : null);
                if (content) {
                    setMessages((current) => [...current, content]);
                }
            },
        });
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = text.trim();
        if (!message) return;

        if (sendWebSocketMessage(socket, message)) {
            setMessages((current) => [...current, message]);
            setText("");
        }
    };

    return (
        <section className="rounded-xl border">
            <ul aria-live="polite" className="flex flex-col gap-4 p-4 text-left">
                {messages.map((message, index) => (
                    <li key={`${index}-${message}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message}
                        </ReactMarkdown>
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
