export interface CustomRewardParams {
  title: string;
  cost: number;
  prompt: string;
  background_color: string;
  global_cooldown_seconds: number;
  global_cooldown_enabled: boolean;
}

export interface CustomRewardResponse {
  broadcaster_name: string;
  broadcaster_login: string;
  broadcaster_id: string;
  id: string;
  image: any;
  background_color: string;
  is_enabled: boolean;
  cost: number;
  title: string;
  prompt: string;
  is_user_input_required: boolean;
  max_per_stream_setting: MaxPerStreamSetting;
  max_per_user_per_stream_setting: MaxPerUserPerStreamSetting;
  global_cooldown_setting: GlobalCooldownSetting;
  is_paused: boolean;
  is_in_stock: boolean;
  default_image: DefaultImage;
  should_redemptions_skip_request_queue: boolean;
  redemptions_redeemed_current_stream: any;
  cooldown_expires_at: any;
}

export interface MaxPerStreamSetting {
  is_enabled: boolean;
  max_per_stream: number;
}

export interface MaxPerUserPerStreamSetting {
  is_enabled: boolean;
  max_per_user_per_stream: number;
}

export interface GlobalCooldownSetting {
  is_enabled: boolean;
  global_cooldown_seconds: number;
}

export interface DefaultImage {
  url_1x: string;
  url_2x: string;
  url_4x: string;
}
