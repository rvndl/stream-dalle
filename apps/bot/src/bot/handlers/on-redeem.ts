import { Configuration, OpenAIApi } from "openai";
import { Server } from "socket.io";
import { ChatUserstate } from "tmi.js";
import { Bot } from "..";
import { prisma } from "@stream-dalle/db";
import axios from "axios";
import { backupArt } from "../../backup";

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
    select: { rewardId: true, APIKey: true },
  });

  if (!user) {
    return;
  }

  if (!user.APIKey || !user.rewardId) {
    return;
  }

  // check if the reward id matches
  if (user.rewardId !== rewardId) {
    return;
  }

  const bot = Bot.getInstance();

  const configuration = new Configuration({
    apiKey: user.APIKey,
  });
  const openAI = new OpenAIApi(configuration);

  try {
    bot.say(channel, `@${chatUser.username} ⏱ Generating your prompt...`);
    const response = await openAI.createImage({
      prompt: message,
      n: 1,
      size: "1024x1024",
      user: chatUser.username,
    });

    const url = response.data.data[0].url;

    const art = {
      url,
      author: redeemer,
      // Strip ascii characters from the message
      prompt: message.replace(/[^a-z0-9]/gi, " "),
    };

    io.to(channel).emit("new-art", art);

    const backupUrl = await backupArt(url);

    await prisma.logs.create({
      data: {
        redeemer,
        url: backupUrl || url,
        prompt: message,
        status: "SUCCESS",
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
        userName: channel.slice(1),
      },
    });

    // Avoid rate limiting
    setTimeout(() => {
      bot.say(
        channel,
        `@${chatUser.username} ❌ Failed to generate your prompt (${reason})`
      );
    }, 2000);

    console.log(error);
  }
};
