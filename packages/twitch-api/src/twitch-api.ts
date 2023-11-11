import axios, { AxiosInstance } from "axios";
import { CustomRewardParams, CustomRewardResponse } from "./types/reward";
import { User } from "./types/user";

const HELIX_URL = "https://api.twitch.tv/helix";

export class TwitchApi {
  private axios: AxiosInstance;

  constructor(clientId: string, token: string) {
    this.axios = axios.create({
      baseURL: HELIX_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": clientId,
      },
    });
  }

  public async getUser(login: string | undefined | null) {
    const { data } = await this.axios.get<{ data: User[] }>(
      "/users?login=" + login
    );
    const [user] = data.data;

    return user;
  }

  public async createCustomReward(
    params: CustomRewardParams,
    broadcasterId: string
  ) {
    const res = await this.axios.post<{ data: CustomRewardResponse[] }>(
      "/channel_points/custom_rewards?broadcaster_id=" + broadcasterId,
      {
        ...params,
        is_user_input_required: true,
      }
    );

    return res;
  }
}
