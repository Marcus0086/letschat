import { ThreeBounce } from "better-react-spinkit";
const Loading = () => {
  return (
    <center
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/assets/loadingchats.svg"
          loading="lazy"
          style={{
            width: "40%",
            height: "40%",
            margin: "2rem",
          }}
        />

        <h1
          style={{
            color: "grey",
            fontSize: "2rem",
          }}
        >
          Loading <ThreeBounce color="grey" />
        </h1>
      </div>
    </center>
  );
};

export default Loading;
