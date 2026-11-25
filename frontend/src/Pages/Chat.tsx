import Page from "../Components/Page";
import { Message } from "../Components/Message";

function ChatPage() {
  return (
    <Page requiresAccount={true}>
      <h1>College Chatbot</h1>
      <Message />
    </Page>
  );
}

export default ChatPage;
