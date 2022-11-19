import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = ({ className, ...rest }: Props) => {
  return (
    <input
      type="checkbox"
      className={twMerge(
        "w-4 h-4 text-purple-600 bg-purple-500/40 rounded border-none focus:ring-purple-500",
        className
      )}
      {...rest}
    ></input>
  );
};
