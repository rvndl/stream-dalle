import { LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = ({ children, className, ...rest }: Props) => (
  <label
    className={twMerge(
      "block mb-1 text-sm font-medium text-gray-900",
      className
    )}
    {...rest}
  >
    {children}
  </label>
);
