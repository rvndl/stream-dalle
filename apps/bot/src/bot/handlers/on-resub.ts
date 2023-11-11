import { Server } from "socket.io";
import { SubUserstate } from "tmi.js";
import { prisma } from "@stream-dalle/db";
import { Dalle } from "@stream-dalle/dalle";
import { getRandomDefaultMessage } from "../../utils";

export const onResub = async (
  channel: string,
  username: string,
  chatUser: SubUserstate,
  subMessage: string,
  io: Server
) => {
  const user = await prisma.user.findFirst({
    where: {
      name: { equals: channel.slice(1), mode: "insensitive" },
    },
    select: {
      rewardId: true,
      APIKey: true,
      model: true,
      hd: true,
      onResub: true,
    },
  });

  if (!user) {
    return;
  }

  if (!user.APIKey) {
    return;
  }

  if (!user.onResub) {
    return;
  }

  const message = subMessage ?? getRandomDefaultMessage(username);

  const dalle = new Dalle({
    APIKey: user.APIKey,
    model: user.model,
    hd: user.hd,
    size: "1024x1024",
  });

  try {
    const imageUrl = await dalle.generateImage(message);

    const art = {
      url: imageUrl,
      author: username,
      prompt: message,
    };

    io.to(channel).emit("new-art", art);

    await prisma.logs.create({
      data: {
        redeemer: username,
        prompt: message,
        type: "RESUB",
        status: "SUCCESS",
        userName: channel.slice(1),
      },
    });
  } catch (error) {
    await prisma.logs.create({
      data: {
        redeemer: username,
        prompt: message,
        type: "RESUB",
        status: "FAILURE",
        userName: channel.slice(1),
      },
    });

    console.log(error);
  }
};
