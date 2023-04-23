import { Lato } from "@next/font/google";
import { useEffect } from "react";
import { motion } from "framer-motion";

const lato = Lato({
  weight: ["100", "400", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

interface Props {
  url: string;
  author: string;
  prompt: string;
  showFrame: boolean;
  showAuthor: boolean;
  showPrompt: boolean;
  preview?: boolean;
}

export const Art = ({
  url,
  author,
  prompt,
  showFrame,
  showAuthor,
  showPrompt,
  preview,
}: Props) => {
  const fontStyle = preview
    ? {
        fontSize: "85%",
        lineHeight: "100%",
        padding: "0.5%",
        textShadow: "4px 3px 6px rgba(0, 0, 0, .2)",
      }
    : {
        fontSize: "2.8vh",
        lineHeight: "3.5vh",
        padding: "0.5vh",
        textShadow: "4px 3px 6px rgba(0, 0, 0, .2)",
      };

  useEffect(() => {
    if (preview) return;

    const audio = new Audio("/alert.mp3");
    audio.play();
  }, [preview]);

  return (
    <div className="h-full w-full select-none" style={lato.style}>
      <img src={url} className="h-full w-fill absolute top-0 left-0" />
      {showPrompt && (
        <motion.div
          transition={{ delay: 0.6 }}
          initial={{ opacity: 0, y: "10vh" }}
          animate={{ opacity: 1, y: "0vh" }}
          style={{ ...fontStyle, backdropFilter: "blur(25px)" }}
          className="px-2 absolute z-20 bottom-0 bg-opacity-100 w-full flex"
        >
          <p>
            <motion.span
              transition={{ delay: 0.8 }}
              initial={{ opacity: 0, y: "1vh" }}
              animate={{ opacity: 1, y: "0vh" }}
              className="font-extrabold text-purple-300"
            >
              {author}:
            </motion.span>
            <motion.span
              transition={{ delay: 1 }}
              initial={{ opacity: 0, y: "1vh" }}
              animate={{ opacity: 1, y: "0vh" }}
              className="ml-1 text-gray-100 font-semibold"
            >
              {prompt}
            </motion.span>
          </p>
        </motion.div>
      )}
    </div>
  );
};
