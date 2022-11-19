import { Socket } from "socket.io";
import { prisma } from "@stream-dalle/db";
import cookie from "cookie";
import { Bot } from "../../bot";

export const onChannelJoin = async (socket: Socket) => {
  const cookies = cookie.parse(socket.request.headers.cookie || "");
  const sessionToken = cookies["next-auth.session-token"];

  const session = await prisma.session.findFirst({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || !session.user.name) {
    return;
  }

  const bot = Bot.getInstance();
  bot.joinChannel(session.user.name);

  socket.emit("channel-join-success");
};
