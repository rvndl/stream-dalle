import { type NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

import { prisma } from "@stream-dalle/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,

      authorization: {
        params: {
          scope: "openid user:read:email channel:manage:redemptions",
          claims: {
            id_token: {
              email: null,
              picture: null,
              preferred_username: null,
            },
          },
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // @ts-ignore - TODO: Fix this
      session.user.id = user.id;
      return session;
    },
  },
};
