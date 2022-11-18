import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ children, className }: Props) => (
  <div
    className={twMerge("p-4 bg-white border rounded-lg shadow-sm", className)}
  >
    {children}
  </div>
);
