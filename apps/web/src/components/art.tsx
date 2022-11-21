import { El_Messiri } from "@next/font/google";
import clsx from "clsx";
import { useEffect } from "react";

const elMessiri = El_Messiri({
  weight: "400",
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
        textShadow: "4px 3px 6px rgba(66, 68, 90, 1)",
      }
    : {
        fontSize: "4vh",
        lineHeight: "4vh",
        padding: "0.5vh",
        textShadow: "4px 3px 6px rgba(66, 68, 90, 1)",
      };

  useEffect(() => {
    if (preview) return;

    const audio = new Audio("/alert.mp3");
    audio.play();
  }, [preview]);

  return (
    <div className="h-full w-full select-none" style={elMessiri.style}>
      {showAuthor && (
        <p
          className="absolute z-20 top-0 bg-black bg-opacity-40 text-center w-full"
          style={fontStyle}
        >
          {author}
        </p>
      )}
      {showFrame && (
        <img src="/image-frame.webp" className="h-full z-10 absolute" />
      )}
      <img
        src={url}
        className={clsx(
          "h-full w-fill absolute top-0 left-0",
          showFrame && " scale-[.8]"
        )}
      />
      {showPrompt && (
        <p
          className="absolute z-20 bottom-0 bg-black bg-opacity-40 text-center w-full"
          style={fontStyle}
        >
          “{prompt}”
        </p>
      )}
    </div>
  );
};
