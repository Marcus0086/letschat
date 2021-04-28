import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Title>Let's Chat!</Title>
        <Logo src="/assets/chat.svg" loading="lazy" />
        <SignInButton variant="outlined" onClick={signIn}>
          Sign In With Google
        </SignInButton>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-image: url("/assets/background.png");
  user-select: none;
`;

const Title = styled.h1`
  color: grey;
  font-size: 2rem;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 0.5rem;
  box-shadow: 0 1px 10px #ccc;
  padding: 5rem;
`;
const Logo = styled.img`
  && {
    width: 40%;
    height: 40%;
    @media (max-width: 700px) {
      width: 50%;
      height: 50%;
    }
    @media (max-width: 500px) {
      width: 70%;
      height: 70%;
    }
    @media (max-width: 400px) {
      width: 90%;
      height: 90%;
    }
  }
  margin: 2rem;
`;
const SignInButton = styled(Button)`
  && {
    background-color: blue;
    color: white;
    border: none;
    :hover {
      background-color: darkblue;
    }
  }
`;
