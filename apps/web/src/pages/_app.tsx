import { Session } from "next-auth";
import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
import { trpc } from "../utils/tprc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return <SessionProvider session={session}>
     <Component {...pageProps} />
  </SessionProvider>;
};

export default trpc.withTRPC(MyApp);
