import { Bot } from "./bot";
import { createServer } from "https";
import { Server } from "socket.io";
import { joinRooms, onChannelJoin } from "./socket";
import { onRedeem } from "./bot/handlers/on-redeem";
import * as fs from "fs";
import express from "express";
import { onResub } from "./bot/handlers/on-resub";

async function bootstrap() {
  const app = express();
  const bot = Bot.getInstance();

  bot.on("connected", () => console.log("tmi: Connected to Twitch"));
  bot.on("reconnect", () => console.log("tmi: Reconnecting to Twitch"));
  bot.on("disconnected", () => console.log("tmi: Disconnected from Twitch"));

  const https = createServer(
    {
      cert: fs.readFileSync(process.env.SSL_CERT!),
      key: fs.readFileSync(process.env.SSL_KEY!),
    },
    app
  );

  app.use(express.static("backup"));

  const io = new Server(https, {
    cookie: true,
    cors: {
      origin: process.env.NEXTAUTH_URL,
      credentials: true,
    },
  });

  bot.on("message", async (channel, user, message) =>
    onRedeem(channel, user, message, io)
  );

  bot.on("resub", async (channel, username, _, message, user) => {
    onResub(channel, username, user, message, io);
  });

  io.on("connection", (socket) => {
    socket.on("channel-join", () => onChannelJoin(socket));
    joinRooms(socket);
  });

  https.listen(process.env.TWITCH_BOT_WS_PORT);
}

bootstrap().catch((err) => console.error(err));
