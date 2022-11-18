import clsx from "clsx";

interface Steps {
  total: number;
  current: number;
}

export const Steps = ({ total, current }: Steps) => {
  if (total < 1) {
    throw new Error("Steps total must be greater than 0");
  }

  return (
    <div className="flex gap-8 items-center">
      {Array.from({ length: total }, (_, i) => {
        const active = current >= i + 1;
        return (
          <div
            className={clsx(
              "border rounded-full shrink-0 w-16 h-16 flex items-center justify-center",
              active
                ? "border-purple-400 bg-purple-400 bg-opacity-10"
                : "border-gray-600"
            )}
          >
            <p
              className={clsx(
                "leading-none text-xl",
                active ? "font-semibold text-purple-500" : "text-gray-500"
              )}
            >
              {i + 1}
            </p>
          </div>
        );
      })}
    </div>
  );
};
