import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../components/ui";

export default function Page() {
  const [redirecting, setRedirecting] = useState(false);
  const handleOnSignIn = () => {
    setRedirecting(true);
    signIn("twitch");
  };

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center gap-24">
      <h1
        className="font-bold text-6xl"
        style={{
          background: "linear-gradient(90deg, #a855f7, #c084fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Stream DALL·E
        <span className="text-purple-700 text-base ml-2">beta</span>
      </h1>

      <Button loading={redirecting} onClick={handleOnSignIn}>
        Login with Twitch
      </Button>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
