import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { UserTable } from "../Components/UserTable";
import { MessageForm } from "../Components/Message";
import {
  sendWebSocketMessage,
  websocketSetup,
  type WebSocketConnectionStatus,
  type WebSocketResponse,
} from "../Utilities/Websocket.utilities";

// Home Page for authenticated users. Will show their favourited books using the BookBtn component, alongside how much stock there is.

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
      {!user ? (
        <>
          <p>Chat: {connectionStatus}</p>
          <MessageForm
            onSendMessage={sendMessage}
            disabled={connectionStatus !== "Connected"}
          />
          <ul aria-live="polite">
            {messages.map((message, index) => (
              <li key={`${index}-${message}`}>{message}</li>
            ))}
          </ul>
          <Link to="/login">Sign in to see your favourites!</Link>
          <></>
        </>
      ) : ( <> <UserTable /> </> )}
    </Page>
  );
};

export default Home;
