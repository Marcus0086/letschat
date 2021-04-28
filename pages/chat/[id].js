import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import Chatscreen from "../../components/Chatscreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRrecepientEmail from "../../utils/getRrecepientEmail";
const Chat = ({ chat, messages }) => {
  const hashcode = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; ++i) {
      let char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= hash;
    }
    return Math.abs(hash);
  };
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRrecepientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <Chatcontainer>
        <Chatscreen chat={chat} messages={messages} />
      </Chatcontainer>
    </Container>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const messagesRef = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
  const messages = messagesRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const Chatcontainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
