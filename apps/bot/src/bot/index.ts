import { Client, Events } from "tmi.js";
import { prisma } from "@stream-dalle/db";

type ListenerType<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [never]
  ? []
  : [T];

export class Bot {
  private static instance: Bot;
  private client: Client;

  private constructor() {
    this.client = new Client({
      options: { debug: false },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: process.env.TWITCH_BOT_USERNAME!,
        password: process.env.TWITCH_BOT_OAUTH!,
      },
    });

    this.client.connect().then(() => this.loadChannels());

    this.client.on("connected", () => console.log("tmi: Connected to Twitch"));
    this.client.on("reconnect", () =>
      console.log("tmi: Reconnecting to Twitch")
    );
    this.client.on("disconnected", () =>
      console.log("tmi: Disconnected from Twitch")
    );
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }

    return Bot.instance;
  }
  public on<P extends keyof Events, T>(
    event: P,
    listener: (...args: ListenerType<Events[P]>) => void
  ) {
    this.client.on(event, listener);
  }

  public say(channel: string, message: string) {
    this.client.say(channel, message);
  }

  public sayTimed(channel: string, message: string, timeout: number = 2000) {
    return setTimeout(() => this.say(channel, message), timeout);
  }

  public getChannels(): string[] {
    return this.client.getChannels();
  }

  public async joinChannel(channel: string) {
    const hashedChannel = `#${channel.toLowerCase()}`;

    if (!this.getChannels().includes(hashedChannel)) {
      await prisma.user.updateMany({
        where: { name: channel },
        data: { connected: true },
      });

      await this.client.join(channel);
      await this.client.say(hashedChannel, "✅ Joined channel");

      console.log("Joined channel", hashedChannel);
    }
  }

  private async loadChannels() {
    const channels = await prisma.user.findMany({
      where: { connected: true },
      select: { name: true },
    });

    channels.forEach(({ name }) => {
      if (name) {
        const hashedChannel = `#${name.toLowerCase()}`;

        console.log("tmi: Joining channel", hashedChannel);
        this.client.join(hashedChannel);
      }
    });
  }
}
