import { Bot } from "./bot";
import { createServer as createHTTPServer, Server as ServerHTTP } from "http";
import {
  createServer as createHTTPSServer,
  Server as ServerHTTPS,
} from "https";
import { joinRooms, onChannelJoin } from "./socket";
import * as fs from "fs";
import express from "express";
import { onResub, onFirstMessage, onRedeem } from "./bot/handlers";
import { Server } from "socket.io";

async function bootstrap() {
  const app = express();
  const bot = Bot.getInstance();

  let webServer: ServerHTTP | ServerHTTPS;

  if (process.env.USE_HTTPS === "true") {
    webServer = createHTTPSServer(
      {
        cert: fs.readFileSync(process.env.SSL_CERT!),
        key: fs.readFileSync(process.env.SSL_KEY!),
      },
      app
    );
  } else {
    webServer = createHTTPServer(app);
  }

  app.use(express.static("backup"));

  const io = new Server(webServer, {
    cookie: true,
    cors: {
      origin: process.env.NEXTAUTH_URL,
      credentials: true,
    },
  });

  bot.on("message", async (channel, user, message) => {
    if (message === "sd!ping") {
      bot.say(channel, "Pong");
    }

    onFirstMessage(channel, user, message, io);
    onRedeem(channel, user, message, io);
  });

  bot.on("resub", async (channel, username, _, message, user) => {
    onResub(channel, username, user, message, io);
  });

  io.on("connection", (socket) => {
    socket.on("channel-join", () => onChannelJoin(socket));
    joinRooms(socket);
  });

  webServer.listen(process.env.TWITCH_BOT_WS_PORT);
}

bootstrap().catch((err) => console.error(err));
