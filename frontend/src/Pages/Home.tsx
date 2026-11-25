import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  sendWebSocketMessage,
  websocketSetup,
  type WebSocketConnectionStatus,
  type WebSocketResponse,
} from "../Utilities/Websocket.utilities";

// Home Page

interface HomeProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function Home({ }: HomeProps) {
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
    sendWebSocketMessage(socket, text);
  };

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <Page>
      <>
        <h1>🚧 UNDER CONSTRUCTION 🚧</h1>
      </>
    </Page>
  );
};

export default Home;
