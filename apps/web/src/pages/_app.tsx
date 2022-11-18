import { Session } from "next-auth";
import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
import { trpc } from "../utils/tprc";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Stream DALL·E</title>
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
