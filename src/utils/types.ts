export type DISIForm = {
  username: string | null;
  colorMode: string;
  smallCardDetailMode: string;
  backgroundSingle: string;
  backgroundGradient1: string;
  backgroundGradient2: string;
  backgroundGradientAngle: number;
  largeCardActivity: boolean;
  largeCardMood: boolean;
  largeCardCreated: boolean;
  aboutMe: string;
  bannerColor: string;
  pronouns: string;
  discordLabel: boolean;
};

type GeneralActivityType = {
  type: string;
  name: string;
};

type ListeningActivityType = {
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
  ListeningActivityType &
  StreamingActivityType &
  OtherActivityType;
