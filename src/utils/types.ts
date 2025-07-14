type GeneralActivityType = {
  type: string;
  name: string;
};

type SpotifyActivityType = {
  platform: string;
  timestamps: {
    start: string;
    end: string;
    duration: string;
  };
  artists: string[];
  album: {
    name: string;
    cover: string;
  };
};

type ListeningActivityType = {
  type: string;
  name: string; // platform
  details: string; // song name
  state: string; // artist
  timestamps: {
    start: number;
    end: number;
  };
  assets: {
    large_image: string;
    small_image: string;
  };
};

type StreamingActivityType = {
  platform: string;
  twitch_name: string;
  url: string;
  game: string;
};

type OtherActivityType = {
  application_id: string;
  timestamps: {
    start: number;
  };
  details: string;
  state: string;
  assets: {
    large_image: string;
    small_image: string;
  };
};

export type ActivityType = GeneralActivityType &
  SpotifyActivityType &
  ListeningActivityType &
  StreamingActivityType &
  OtherActivityType;

export type MoodType = {
  type: number;
  state: string; // message
  name: string;
  emoji: EmojiType;
};

export type EmojiType = {
  id: number;
  name: string;
  animated?: boolean;
};

export type RefinerResponse = {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  status: string;
  banner: string | null;
  accent_color: string | null;
  created_at: string;
  activity: ActivityType;
  mood: MoodType;
  urls: string[];
};

export type MaintenanceMessageType = {
  error500: {
    date: string;
    title: string;
    message: string;
    active: boolean;
  };
  scheduled: {
    date: string;
    active: boolean;
  };
};

export type ColorMode = 'Single' | 'Gradient' | 'Discord Accent Color';
export type BannerMode = 'Custom Color' | string;

export interface DISIForm {
  username: string | null;
  colorMode: ColorMode;
  backgroundSingle: string;
  backgroundGradient1: string;
  backgroundGradient2: string;
  backgroundGradientAngle: number;
  displayUsername: boolean;
  activity: boolean;
  mood: boolean;
  created: boolean;
  aboutMe: string;
  bannerColor: string;
  pronouns: string;
  discordLabel: boolean;
}

export interface DISIStore {
  smallCardLink: string;
  largeCardLink: string;
  smallTail: string;
  largeTail: string;
  userID: string;
  colorMode: ColorMode;
  wantLargeCard: boolean;
  bannerMode: BannerMode;
  customBannerMode: string;
  externalImageURL: string;
  bannerPBID: string;
  bannerFile: File | null;

  // Setters
  setSmallCardLink: (v: string) => void;
  setLargeCardLink: (v: string) => void;
  setSmallTail: (v: string) => void;
  setLargeTail: (v: string) => void;
  setUserID: (v: string) => void;
  setColorMode: (v: ColorMode) => void;
  setWantLargeCard: (v: boolean) => void;
  setBannerMode: (v: BannerMode) => void;
  setCustomBannerMode: (v: string) => void;
  setExternalImageURL: (v: string) => void;
  setBannerPBID: (v: string) => void;
  setBannerFile: (file: File | null) => void;
}
