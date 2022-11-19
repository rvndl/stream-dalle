import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { trpc } from "../utils/tprc";

export const useOverlayUrl = () => {
  const [url, setUrl] = useState("");
  const session = useSession({ required: true });
  const { data } = trpc.auth.getSettings.useQuery();

  // useEffect ensures we're running on client-side to avoid SSR issues
  useEffect(() => {
    setUrl(
      window.location.origin +
        "/overlay/" +
        session.data?.user?.name +
        "/" +
        data?.showAuthor +
        "/" +
        data?.showFrame +
        "/" +
        data?.showPrompt +
        "/" +
        data?.showTime
    );
  }, [data]);

  return url;
};
