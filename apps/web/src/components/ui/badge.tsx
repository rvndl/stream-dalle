import clsx from "clsx";

type Variant = "success" | "error" | "warning";

interface Props {
  variant?: Variant;
  children: any;
}

export const Badge = ({ variant = "success", children }: Props) => {
  return (
    <span
      className={clsx(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        {
          "bg-green-100 text-green-800": variant === "success",
          "bg-red-100 text-red-800": variant === "error",
          "bg-yellow-100 text-yellow-800": variant === "warning",
        }
      )}
    >
      {children}
    </span>
  );
};
