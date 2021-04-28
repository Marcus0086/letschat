import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import getRrecepientEmail from "../utils/getRrecepientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { DeleteSharp, EditSharp } from "@material-ui/icons";
import { useState } from "react";
import { useRouter } from "next/router";
const Chat = ({ id, users }) => {
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
  const router = useRouter();
  const store = localStorage;
  const [user] = useAuthState(auth);
  const receipentEmail = getRrecepientEmail(users, user);
  const [receipentName] = receipentEmail.split("@");
  const [receipentSnapShot] = useCollection(
    db.collection("users").where("email", "==", getRrecepientEmail(users, user))
  );
  const storeData = id + receipentName;
  const receipent = receipentSnapShot?.docs?.[0]?.data();
  let [username, setuserName] = useState(
    store.getItem(hashcode(storeData))
      ? JSON.parse(store.getItem(hashcode(storeData))).username
      : receipentName
  );
  let input = undefined;
  const deleteChat = () => {
    db.collection("chats").doc(id).delete();
    store.removeItem(hashcode(storeData));
  };
  const editName = () => {
    input = prompt("Enter the new name:");
    const newuser = { username: input };
    store.setItem(hashcode(storeData), JSON.stringify(newuser));
    setuserName(newuser.username);
  };

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {receipent ? (
        <UserAvatar src={receipent?.photoURL} />
      ) : (
        <UserAvatar>{receipentEmail[0]}</UserAvatar>
      )}

      <RContainer>
        <RName>{username || receipentName}</RName>
        <REmail>{receipentEmail}</REmail>
      </RContainer>

      <IContainer>
        <IconButton onClick={editName}>
          <EditSharp color="primary" aria-label="Edit" title="Edit" />
        </IconButton>
        <IconButton onClick={deleteChat}>
          <DeleteSharp color="secondary" aria-label="Delete" title="Delete" />
        </IconButton>
      </IContainer>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 0.5rem;
  word-break: break-word;
  user-select: none;
  :hover {
    background-color: #e9eaeb;
  }
`;

const RContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  color: grey;
  padding: 0.5rem;
  margin-right: auto;
`;

const IContainer = styled.div`
  color: grey;
  padding: 1rem;
`;

const UserAvatar = styled(Avatar)`
  margin: 0.5rem;
  :hover {
    opacity: 0.8;
    transition: all 0.2s ease-in-out;
  }
`;

const REmail = styled.h3`
  font-size: 0.8rem;
  margin: 0;
`;

const RName = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #000;
`;
