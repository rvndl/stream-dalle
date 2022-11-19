import { Button, Card, Input, Label } from "../components/ui";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Logs, Settings } from "../components/dashboard";

const Dashboard = () => {
  return (
    <main className="p-4 flex flex-col items-center">
      <nav className="w-full flex justify-between">
        <h1
          className="font-extrabold text-xl"
          style={{
            background: "linear-gradient(90deg, #a149f5, #c89af5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Stream DALL·E
          <span className="text-purple-700  ml-2 text-xs">beta</span>
        </h1>
        <Button
          size="sm"
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: "/",
            })
          }
        >
          Sign out
        </Button>
      </nav>
      <section className="flex mt-8 gap-4 w-full max-w-screen-lg">
        <Settings />
        <Logs />
      </section>
    </main>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma?.user.findFirst({
    where: {
      name: session.user?.name,
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!user.APIKey || !user.connected || !user.rewardId) {
    return {
      redirect: {
        destination: "/setup",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
