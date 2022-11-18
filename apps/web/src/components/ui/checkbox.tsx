import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = ({ className, ...rest }: Props) => {
  return (
    <input
      type="checkbox"
      className={twMerge(
        "w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500",
        className
      )}
      {...rest}
    ></input>
  );
};
