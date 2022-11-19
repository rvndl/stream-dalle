import { Configuration, OpenAIApi } from "openai";
import { Server } from "socket.io";
import { ChatUserstate } from "tmi.js";
import { Bot } from "..";

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

  const user = await prisma?.user.findFirst({
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
    bot.say(channel, `@${chatUser.username} Generating your prompt...`);
    const response = await openAI.createImage({
      prompt: message,
      n: 1,
      size: "512x512",
    });

    const art = {
      url: response.data.data[0].url,
      author: chatUser["display-name"],
      prompt: message,
    };

    io.to(channel).emit("new-art", art);
  } catch (error) {
    bot.say(channel, `@${chatUser.username} Failed to generate your prompt`);
    console.log(error);
  }
};