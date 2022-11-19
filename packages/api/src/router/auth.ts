import { TwitchApi } from "@stream-dalle/twitch-api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const authRouter = router({
  logs: protectedProcedure.query(async ({ ctx }) => {
    const { name } = ctx.session?.user;
    if (!name) {
      return [];
    }

    const logs = await ctx.prisma?.logs.findMany({
      where: {
        userName: {
          equals: name,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return logs;
  }),
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma?.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        showAuthor: true,
        showPrompt: true,
        showFrame: true,
        showTime: true,
      },
    });
  }),
  updateSettings: protectedProcedure
    .input(
      z.object({
        showAuthor: z.boolean(),
        showPrompt: z.boolean(),
        showFrame: z.boolean(),
        showTime: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma?.user.updateMany({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
        },
      });

      return true;
    }),
  updateApiKey: protectedProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma?.user.updateMany({
        where: { id: ctx.session.user.id },
        data: { APIKey: input.apiKey },
      });

      return true;
    }),
  createReward: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        cost: z.number().positive(),
        prompt: z.string(),
        backgroundColor: z.string(),
        cooldown: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { backgroundColor, cooldown, cost, prompt, title } = input;

      try {
        const account = await ctx.prisma?.account.findFirst({
          where: { userId: ctx.session.user.id },
          select: {
            access_token: true,
          },
        });

        const api = new TwitchApi(
          process.env.TWITCH_CLIENT_ID!,
          account?.access_token || ""
        );
        const user = await api.getUser(ctx.session.user.name);
        const res = await api.createCustomReward(
          {
            title,
            cost,
            prompt,
            background_color: backgroundColor,
            global_cooldown_seconds: cooldown,
            global_cooldown_enabled: true,
          },
          user.id
        );

        if (res.status === 200) {
          const rewardId = res.data.data[0].id;

          await ctx.prisma?.user.updateMany({
            where: {
              id: ctx.session.user.id,
            },
            data: { rewardId },
          });
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create reward",
        });
      }

      return true;
    }),
});
