import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticon from "@material-ui/icons/InsertEmoticon";
import EnterKey from "@material-ui/icons/Send";
import MicButton from "@material-ui/icons/Mic";
import { useState, useRef } from "react";
import firebase from "firebase";
import getRrecepientEmail from "../utils/getRrecepientEmail";
import TimeAgo from "timeago-react";
const Chatscreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const dummy = useRef();
  const [messageSnapShot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const showMessage = () => {
    if (messageSnapShot) {
      return messageSnapShot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      })
      .then((e) => {
        setInput("");
        dummy.current.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  };
  const [receipentSnapShot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRrecepientEmail(chat.users, user))
  );
  const reciepient = receipentSnapShot?.docs?.[0]?.data();
  const recEmail = getRrecepientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {reciepient ? (
          <Avatar src={reciepient?.photoURL} />
        ) : (
          <Avatar>{recEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recEmail}</h3>
          {receipentSnapShot ? (
            <p>
              Last active:{" "}
              {reciepient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={reciepient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last seen...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessage()}
        <EndOfMessage ref={dummy} />
      </MessageContainer>
      <InputContainer onSubmit={(e) => e.preventDefault()}>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <IconButton disabled={!input} onClick={sendMessage}>
          <EnterKey />
        </IconButton>
        <IconButton>
          <MicButton />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default Chatscreen;
const Container = styled.div``;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin: 1rem;
  > h3 {
    margin-bottom: 3px;
    font-size: 1rem;
  }

  > p {
    color: gray;
    font-size: 0.65rem;
  }
  user-select: none;
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 3rem;
  background-color: #efded8;
  min-height: 90vh;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 1.25rem;
  background-color: whitesmoke;
  color: grey;
  font-size: 1rem;
  outline: 0;
  border: none;
  border-radius: 1rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
`;

const EndOfMessage = styled.div`
  margin-bottom: 0.5rem;
`;
