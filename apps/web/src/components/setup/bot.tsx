import { useEffect, useRef, useState } from "react";
import { useStepStore } from "../../store/step";
import { Button, Card } from "../ui";
import { io, Socket } from "socket.io-client";

export const Bot = () => {
  const [connecting, setConnecting] = useState(true);
  const [joining, setJoining] = useState(false);
  const nextStep = useStepStore((state) => state.nextStep);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      setConnecting(false);
    });

    socket.current.on("channel-join-success", () => nextStep());

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const handleOnConnect = () => {
    setJoining(true);
    socket.current?.emit("channel-join");
  };

  return (
    <Card
      title="Setup StreamDalle Bot"
      description="Connect StreamDalle Bot to your Twitch channel."
      className="w-full md:w-[30rem]"
    >
      <div className="mt-4 flex flex-rocolw gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <Button
            className="mt-2"
            loading={joining || connecting}
            onClick={handleOnConnect}
          >
            {connecting ? "Loading..." : joining ? "Connecting..." : "Connect"}
          </Button>
        </section>
      </div>
    </Card>
  );
};
