import { Model } from "@stream-dalle/db";
import OpenAI from "openai";

const mappedModels: Record<Model, string> = {
  DALLE2: "dall-e-2",
  DALLE3: "dall-e-3",
};

type Size = "1024x1024";

interface Settings {
  APIKey: string;
  model: Model;
  size: Size;
  hd?: boolean;
}

export class Dalle {
  private openai: OpenAI;
  private settings: Settings;

  constructor(settings: Settings) {
    this.openai = new OpenAI({ apiKey: settings.APIKey });
    this.settings = settings;
  }

  public async generateImage(prompt: string) {
    const { size, hd } = this.settings;
    const model = mappedModels[this.settings.model];

    const response = await this.openai.images.generate({
      model,
      size,
      n: 1,
      prompt,
      quality: hd ? "hd" : "standard",
    });

    const url = response.data[0].url;
    return url;
  }
}
