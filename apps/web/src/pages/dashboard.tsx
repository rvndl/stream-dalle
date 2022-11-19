import { Button, Card, Input, Label } from "../components/ui";
import { getSession, signOut } from "next-auth/react";
import { useOverlayUrl } from "../hooks/use-overlay-url";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const Dashboard = () => {
  const url = useOverlayUrl();
  const router = useRouter();

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
        <Card title="Settings" className="self-start">
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <Label>Overlay url</Label>
              <Input
                value={url}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <Button size="sm" onClick={() => router.push("/setup")}>
              Rerun setup
            </Button>
          </div>
        </Card>
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
