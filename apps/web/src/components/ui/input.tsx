import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...rest }: Props) => {
  return (
    <input
      {...rest}
      className={twMerge(
        "block w-full p-2 text-gray-200 border border-gray-700 rounded-lg bg-gray-800 sm:text-xs focus:outline-none focus:border-purple-400 transition-colors",
        className
      )}
    ></input>
  );
};
