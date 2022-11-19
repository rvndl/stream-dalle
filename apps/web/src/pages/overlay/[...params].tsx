import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Art } from "../../components/art";
import { AnimatePresence, motion } from "framer-motion";
import { io, Socket } from "socket.io-client";

interface Art {
  author: string;
  prompt: string;
  url: string;
}

interface Event extends Art {
  id: string;
}

const Overlay = () => {
  const [queue, setQueue] = useState<Art[]>([]);
  const socket = useRef<Socket | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const params = router.query.params as string[];

  const channel = params?.[0];
  const showAuthor = params?.[1] === "true";
  const showFrame = params?.[2] === "true";
  const showPrompt = params?.[3] === "true";
  const showTime = parseInt(params?.[4] || "10000");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.background = "transparent";
    document.body.style.color = "white";
    document.body.style.padding = "0";
  }, []);

  useEffect(() => {
    if (!channel) return;

    socket.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
      reconnectionDelayMax: 10000,
      withCredentials: true,
      query: { channel },
    });

    socket.current.on("new-art", (data) => {
      const image = new Image();
      image.src = data.url;
      image.onload = () => {
        setQueue((queue) => [...queue, data]);
      };
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [channel]);

  useEffect(() => {
    interval.current = setInterval(() => {
      setQueue((queue) => {
        return queue.slice(1);
      });
    }, showTime);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [showTime, queue]);

  return (
    <AnimatePresence>
      {queue[0] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={"h-screen w-screen relative overflow-hidden"}
        >
          <Art
            url={queue[0].url}
            author={queue[0].author}
            prompt={queue[0].prompt}
            showAuthor={showAuthor}
            showFrame={showFrame}
            showPrompt={showPrompt}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
