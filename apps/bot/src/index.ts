import { Bot } from "./bot";
import { createServer } from "http";
import { Server } from "socket.io";
import { joinRooms, onChannelJoin } from "./socket";
import { onRedeem } from "./bot/handlers/on-redeem";

async function bootstrap() {
  const bot = Bot.getInstance();

  bot.on("connected", () => console.log("tmi: Connected to Twitch"));
  bot.on("reconnect", () => console.log("tmi: Reconnecting to Twitch"));
  bot.on("disconnected", () => console.log("tmi: Disconnected from Twitch"));

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cookie: true,
    cors: {
      origin: process.env.NEXTAUTH_URL,
      credentials: true,
    },
  });

  bot.on("message", async (channel, user, message) =>
    onRedeem(channel, user, message, io)
  );

  io.on("connection", (socket) => {
    socket.on("channel-join", () => onChannelJoin(socket));
    joinRooms(socket);
  });

  httpServer.listen(process.env.TWITCH_BOT_WS_PORT);
}

bootstrap().catch((err) => console.error(err));
