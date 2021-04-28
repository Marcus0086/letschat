import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapShot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Please enter email address");
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input != user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (receipentEmail) => {
    !!chatsSnapShot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === receipentEmail)?.length > 0
    );
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} />

        <IconContainer>
          <IconButton onClick={createChat} aria-label="New Chat">
            <AddIcon />
          </IconButton>
          <IconButton onClick={signOut}>
            <MoreVertIcon aria-label="Sign Out!" />
          </IconButton>
        </IconContainer>
      </Header>

      <SearchButton>
        <SearchIcon />
        <SearchInput placeholder="Search chats!" />
      </SearchButton>
      {chatsSnapShot?.docs.map((chat) => (
        <Chat key={"%" + chat.id} id={chat.id} users={chat.data().users} />
      ))}
      <MessageButton color="primary" araia-label="Open Chats">
        <ChatIcon />
      </MessageButton>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 400px;
  max-width: 450px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  justify-content: space-between;
  padding: 15px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
    transition: all 0.2s ease-in-out;
  }
`;

const IconContainer = styled.div``;

const SearchButton = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
  border-bottom: 1px solid whitesmoke;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: 0.25rem;
`;

const MessageButton = styled(Fab)`
  &&& {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 1.5rem;
    background-color: green;
  }
`;
