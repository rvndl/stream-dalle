import { trpc } from "../../utils/tprc";
import { Badge, Card, Spinner } from "../ui";

export const Logs = () => {
  const { data, isLoading } = trpc.auth.logs.useQuery();

  return (
    <Card title="Logs" className="flex flex-1 self-start">
      <div className="mt-4 flex flex-col w-full gap-2">
        {isLoading && (
          <p className="text-gray-400 font-semibold flex items-center">
            <Spinner className="h-6 w-6 text-purple-400 mr-2" />
            Loading...
          </p>
        )}
        {data?.map((log) => (
          <div className="p-2.5 rounded-md bg-gray-600 flex justify-between flex-row w-full">
            <p className="font-semibold text-sm">{log.redeemer}</p>
            <Badge variant={log.status === "SUCCESS" ? "success" : "error"}>
              {log.status}
            </Badge>
            <p className="text-sm text-gray-400 font-medium">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                log.createdAt
              )}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
