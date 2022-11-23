import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const galleryRouter = router({
  list: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const logs = await ctx.prisma.logs.findMany({
        where: {
          userName: {
            equals: input.name,
            mode: "insensitive",
          },
          status: "SUCCESS",
          url: { not: null },
          prompt: { not: null },
        },
        orderBy: { createdAt: "desc" },
      });

      return logs;
    }),
});
