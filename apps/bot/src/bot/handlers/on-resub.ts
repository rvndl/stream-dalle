import { Server } from "socket.io";
import { SubUserstate } from "tmi.js";
import { prisma } from "@stream-dalle/db";
import axios from "axios";

const paintingTypes = [
  "Portrait",
  "Landscape",
  "Still Life",
  "Abstract",
  "Historical",
  "Genre",
  "Religious",
  "Abstract Expressionism",
  "Surrealism",
  "Impressionism",
  "Cubism",
  "Pop Art",
  "Minimalism",
  "Pointillism",
  "Fauvism",
  "Realism",
  "Symbolism",
];

const painters = [
  "Leonardo da Vinci",
  "Rembrandt",
  "Eugène Delacroix",
  "Claude Monet",
  "Vincent van Gogh",
  "Georges Seurat",
  "Pablo Picasso",
  "Salvador Dalí",
  "Jackson Pollock",
  "Andy Warhol",
  "Henri Matisse",
  "Gustave Courbet",
  "Wassily Kandinsky",
  "Jacques-Louis David",
  "Jean-Honoré Fragonard",
  "Zdzisław Beksiński",
];

const getRandomDefaultMessage = (username: string) => {
  const paintingType =
    paintingTypes[Math.floor(Math.random() * paintingTypes.length)];

  const painter = painters[Math.floor(Math.random() * painters.length)];

  return `${paintingType} painting of ${username}, in the style of ${painter}`;
};

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

  const message = subMessage ?? getRandomDefaultMessage(username);

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
