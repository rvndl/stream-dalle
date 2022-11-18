import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLSelectElement> {}

export const Select = ({ className, children, ...rest }: Props) => {
  return (
    <select
      className={twMerge(
        "block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
};
