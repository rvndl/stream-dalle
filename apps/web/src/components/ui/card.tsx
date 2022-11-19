import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card = ({ title, description, children, className }: Props) => (
  <div
    className={twMerge("bg-gray-800 p-4 rounded-xl flex flex-col", className)}
  >
    {title && <h1 className="font-bold text-2xl">{title}</h1>}
    {description && (
      <p className="text-gray-400 leading-tight text-sm">{description}</p>
    )}
    {children}
  </div>
);
