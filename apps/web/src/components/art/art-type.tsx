import type { LogType } from "@stream-dalle/db";
import { PointsIcon } from "../icons";

interface Props {
  type: LogType;
}

const logTypes: Record<LogType, { text: string; icon?: any }> = {
  UNKNOWN: { text: "Unknown", icon: <p>?</p> },
  FIRST_MESSAGE: { text: "first message", icon: <PointsIcon /> },
  REDEMPTION: { text: "redemption", icon: <PointsIcon /> },
  RESUB: { text: "resub", icon: <PointsIcon /> },
};

export const ArtType = ({ type }: Props) => {
  const log = logTypes[type];

  return (
    <span
      style={{
        fontSize: "2.3vh",
        textShadow: "4px 3px 6px rgba(0, 0, 0, .3)",
        backdropFilter: "blur(25px)",
      }}
      className="px-2 absolute z-20 bg-black bg-opacity-20 flex top-0 right-0 font-extrabold justify-center items-center"
    >
      {log.icon} {log.text}
    </span>
  );
};
