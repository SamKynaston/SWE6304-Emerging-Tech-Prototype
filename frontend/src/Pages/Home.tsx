import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { UserTable } from "../Components/UserTable";
import { MessageForm } from "../Components/Message";

// Home Page for authenticated users. Will show their favourited books using the BookBtn component, alongside how much stock there is.

interface HomeProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function Home({ }: HomeProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting");
  const socket = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setConnectionStatus("WebSocket URL is not configured");
      return;
    }

    const baseUrl = apiUrl.replace(/\/$/, "");
    const ws = new WebSocket(`${baseUrl.replace(/^http/, "ws")}/v1/chat/ws`);
    socket.current = ws;

    ws.onopen = () => setConnectionStatus("Connected");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as { text?: string; error?: string };
      const content = message.text ?? (message.error ? `Error: ${message.error}` : null);
      if (content) {
        setMessages((current) => [...current, content]);
      }
    };
    ws.onerror = () => setConnectionStatus("Connection error");
    ws.onclose = () => setConnectionStatus("Disconnected");

    return () => {
      socket.current = null;
      ws.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    const ws = socket.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text }));
    }
  };

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <Page>
      <>
        <h1>🚧 UNDER CONSTRUCTION 🚧</h1>
        <h2>Codename "Silver Stallion"</h2>
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
          <UserTable />
          <Link to="/login">Sign in to see your favourites!</Link>
          <></>
        </>
      ) : ( <> </> )}
    </Page>
  );
};

export default Home;
