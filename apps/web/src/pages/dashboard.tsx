import { signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession({ required: true });

  return <p onClick={() => signOut()}>dashboard</p>;
};

export default Dashboard;
