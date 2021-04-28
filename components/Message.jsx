import styled from "styled-components";
import { auth } from "../firebase";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
};

export default Message;

const Container = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  padding: 1.5rem;
  border-radius: 0.8rem;
  margin: 1rem;
  min-width: 6rem;
  position: relative;
  text-align: relative;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const TimeStamp = styled.span`
  margin-top: 2.5px;
  color: gray;
  padding: 0.5rem;
  font-size: 8px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  user-select: none;
`;
