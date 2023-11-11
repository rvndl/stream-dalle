import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { LogType } from "@stream-dalle/db";

export const galleryRouter = router({
  list: publicProcedure
    .input(z.object({ name: z.string(), type: z.string() }))
    .query(async ({ ctx, input }) => {
      const logs = await ctx.prisma.logs.findMany({
        where: {
          userName: {
            equals: input.name,
            mode: "insensitive",
          },
          type: input.type as LogType,
          status: "SUCCESS",
          url: { not: null },
          prompt: { not: null },
        },
        orderBy: { createdAt: "desc" },
      });

      return logs;
    }),
  stats: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const stats = await ctx.prisma.logs.groupBy({
        by: ["type"],
        _count: true,
        where: {
          userName: {
            equals: input.name,
            mode: "insensitive",
          },
          type: { not: { equals: "UNKNOWN" } },
          url: { not: { equals: null } },
        },
      });

      return stats;
    }),
});
