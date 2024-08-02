export type DISIForm = {
  username: string | null;
  colorMode: string;
  backgroundSingle: string;
  backgroundGradient1: string;
  backgroundGradient2: string;
  backgroundGradientAngle: number;
  created: boolean;
  aboutMe: string;
  mood: string;
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

type PlayingActivityType = {
  timestamps: {
    start: number;
  };
  details: string;
  state: string;
  assets: {
    largeImage: string;
    smallImage: string;
  };
};

export type ActivityType = GeneralActivityType & ListeningActivityType & PlayingActivityType;
