import axios from "axios";
import { DalleResponse } from "./types/openapi";
import { Model } from "@stream-dalle/db";

const API_URL = "https://api.openai.com/v1/images/generations";

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
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  public async generateImage(prompt: string) {
    const { APIKey, size, hd } = this.settings;
    const model = mappedModels[this.settings.model];

    const response = await axios.post<DalleResponse>(
      API_URL,
      {
        model,
        size,
        n: 1,
        prompt,
        // The `hd` parameter always has to be `true` otherwise the API will error out if specified as `false`
        ...(hd && { hd: true }),
      },
      { headers: { Authorization: `Bearer ${APIKey}` } }
    );

    const url = response.data.data[0].url;
    return url;
  }
}
