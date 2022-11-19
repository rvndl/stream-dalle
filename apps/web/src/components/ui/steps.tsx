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
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => {
        const active = current >= i + 1;
        return (
          <div key={i} className="flex gap-1 items-center">
            <div
              key={i}
              className={clsx(
                "border rounded-full shrink-0 w-16 h-16 flex items-center justify-center transition-all",
                active
                  ? "border-purple-400 bg-purple-400 bg-opacity-10"
                  : "border-gray-600"
              )}
            >
              <p
                className={clsx(
                  "leading-none text-xl transition-all",
                  active ? "font-semibold text-purple-400" : "text-gray-500"
                )}
              >
                {i + 1}
              </p>
            </div>
            {i < total - 1 && (
              <span
                className={clsx(
                  "w-8 h-1 rounded-md transition-all",
                  current >= i + 2 ? "bg-purple-400" : "bg-gray-600/50"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
