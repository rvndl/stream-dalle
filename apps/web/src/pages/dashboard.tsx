import { useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession({ required: true });

  return <>dashboard</>;
};

export default Dashboard;
