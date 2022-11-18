import { useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession({ required: true });

  return <p>Dashboard</p>;
};

export default Dashboard;
