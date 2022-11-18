import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Spinner } from "./spinner";

type ButtonSize = "xs" | "sm" | "base";
type ButtonVariant = "primary" | "secondary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = ({
  size = "base",
  variant = "primary",
  loading,
  children,
  className,
  ...rest
}: Props) => {
  const sizes = clsx(
    { "py-2 px-3 text-xs": size === "xs" },
    { "py-2 px-3 text-sm": size === "sm" },
    { "py-2.5 px-5 text-sm": size === "base" }
  );

  const styles = clsx(
    {
      "text-purple-400 bg-purple-600 bg-opacity-20 hover:bg-opacity-30 focus:outline-none":
        variant === "primary",
    },
    {
      "": variant === "secondary",
    }
  );

  return (
    <button
      className={twMerge(
        "font-medium text-center inline-flex justify-center items-center disabled:cursor-not-allowed rounded-md transition-opacity",
        styles,
        sizes,
        className
      )}
      disabled={loading}
      {...rest}
    >
      {loading && (
        <span className="mr-2">
          <Spinner className="text-purple-400" />
        </span>
      )}
      {children}
    </button>
  );
};
