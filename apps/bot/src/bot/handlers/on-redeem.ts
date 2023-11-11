import { Server } from "socket.io";
import { ChatUserstate } from "tmi.js";
import { Bot } from "..";
import { prisma } from "@stream-dalle/db";
import axios from "axios";
import { backupArt } from "../../backup";
import { Dalle } from "@stream-dalle/dalle";

export const onRedeem = async (
  channel: string,
  chatUser: ChatUserstate,
  message: string,
  io: Server
) => {
  if (!chatUser["custom-reward-id"]) {
    return;
  }

  const rewardId = chatUser["custom-reward-id"];
  const redeemer = chatUser["display-name"] || chatUser.username || "unknown";

  const user = await prisma.user.findFirst({
    where: {
      name: { equals: channel.slice(1), mode: "insensitive" },
    },
    select: { rewardId: true, APIKey: true, model: true, hd: true },
  });

  if (!user) {
    return;
  }

  if (!user.APIKey || !user.rewardId) {
    return;
  }

  // Check if the reward id matches
  if (user.rewardId !== rewardId) {
    return;
  }

  const dalle = new Dalle({
    APIKey: user.APIKey,
    model: user.model,
    hd: user.hd,
    size: "1024x1024",
  });

  const bot = Bot.getInstance();

  try {
    bot.say(channel, `@${chatUser.username} ⏱ Generating your prompt...`);
    const imageUrl = await dalle.generateImage(message);

    const art = {
      url: imageUrl,
      author: redeemer,
      prompt: message,
      type: "REDEMPTION",
    };

    io.to(channel).emit("new-art", art);

    const backupUrl = await backupArt(imageUrl);

    await prisma.logs.create({
      data: {
        redeemer,
        url: backupUrl || imageUrl,
        prompt: message,
        status: "SUCCESS",
        type: "REDEMPTION",
        userName: channel.slice(1),
      },
    });
  } catch (error) {
    let reason = "Unknown error";

    if (axios.isAxiosError(error)) {
      reason = error.response?.statusText || "Unknown DALL-E error";
    }

    await prisma.logs.create({
      data: {
        redeemer,
        prompt: message,
        status: "FAILURE",
        type: "REDEMPTION",
        userName: channel.slice(1),
      },
    });

    bot.sayTimed(
      channel,
      `@${chatUser.username} ❌ Failed to generate your prompt (${reason})`
    );
    console.log(error);
  }
};
