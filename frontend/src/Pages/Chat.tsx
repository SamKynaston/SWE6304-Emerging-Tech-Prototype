import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MessageForm } from "../Components/Message";
import {
  sendWebSocketMessage,
  websocketSetup,
  type WebSocketConnectionStatus,
  type WebSocketResponse,
} from "../Utilities/Websocket.utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Home Page for authenticated users. Will show their favourited books using the BookBtn component, alongside how much stock there is.

interface ChatPageProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function ChatPage({ }: ChatPageProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>("Connecting");
  const socket = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const sendMessage = (text: string) => {
    setMessages((current) => [...current, text]);
    sendWebSocketMessage(socket, text);
  };

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <Page requiresAccount={true}>
        <>
            <h1>College Chatbot</h1>
        </>

        <>
            <p>Chat: {connectionStatus}</p>
            
            <ul aria-live="polite" className="flex flex-col gap-4">
            {messages.map((message, index) => (
                <li key={`${index}-${message}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </ReactMarkdown>
                </li>
            ))}
            </ul>

            <MessageForm onSendMessage={sendMessage} disabled={connectionStatus !== "Connected"}/>
        </>
    </Page>
  );
};

export default ChatPage;
