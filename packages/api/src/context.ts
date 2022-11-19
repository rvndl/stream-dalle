import { getServerSession, Session } from "@stream-dalle/auth";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = (await getServerSession(opts)) as Session & {
    user: { id: string };
  };

  return {
    session: session,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
