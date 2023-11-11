import { Server } from "socket.io";
import { SubUserstate } from "tmi.js";
import { prisma } from "@stream-dalle/db";
import axios from "axios";

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
    select: { rewardId: true, APIKey: true, onResub: true },
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

  const message = subMessage ?? chatUser["system-msg"];

  try {
    // TODO: use official OpenAI package when DALLE-3 support gets added
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: message,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${user.APIKey}`,
        },
      }
    );

    const url = response.data.data[0].url;

    const art = {
      url,
      author: username,
      // Strip ascii characters from the message
      prompt: message.replace(/[^a-z0-9]/gi, " "),
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
