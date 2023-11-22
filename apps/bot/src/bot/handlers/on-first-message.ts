import { Server } from "socket.io";
import { ChatUserstate } from "tmi.js";
import { prisma } from "@stream-dalle/db";
import { Dalle } from "@stream-dalle/dalle";
import { backupArt } from "../../backup";

export const onFirstMessage = async (
  channel: string,
  chatUser: ChatUserstate,
  message: string,
  io: Server
) => {
  if (!chatUser["first-msg"]) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      name: { equals: channel.slice(1), mode: "insensitive" },
    },
    select: {
      rewardId: true,
      APIKey: true,
      model: true,
      hd: true,
      onFirstMessage: true,
    },
  });

  if (!user) {
    return;
  }

  if (!user.APIKey) {
    return;
  }

  if (!user.onFirstMessage) {
    return;
  }

  const username = chatUser["display-name"] || chatUser.username || "unknown";

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
      type: "FIRST_MESSAGE",
    };

    io.to(channel).emit("new-art", art);

    const backupUrl = await backupArt(imageUrl);
    await prisma.logs.create({
      data: {
        url: backupUrl,
        redeemer: username,
        prompt: message,
        type: "FIRST_MESSAGE",
        status: "SUCCESS",
        userName: channel.slice(1),
      },
    });
  } catch (error) {
    await prisma.logs.create({
      data: {
        redeemer: username,
        prompt: message,
        type: "FIRST_MESSAGE",
        status: "FAILURE",
        userName: channel.slice(1),
      },
    });

    console.log(error);
  }
};
