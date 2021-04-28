import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function main() {
  return (
    <div>
      <Head>
        <title>Let's Chat</title>
        <link ref="shortcut icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </div>
  );
}
