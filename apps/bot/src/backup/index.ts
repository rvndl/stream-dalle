import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { v4 } from "uuid";

export const backupArt = async (url?: string) => {
  if (!url) return;

  const uuid = v4();
  const input = await (await axios({ url, responseType: "arraybuffer" })).data;

  if (!existsSync("./backup")) {
    mkdirSync("./backup");
  }

  const fileName = `${uuid}.webp`;

  try {
    await sharp(input).webp().toFile(`./backup/${fileName}`);
    console.log(`backup: Saved ${fileName}`);

    return fileName;
  } catch (error) {
    console.error(error);

    return null;
  }
};
