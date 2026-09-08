export const debugging = import.meta.env.DEV;

export const refinerAPI = debugging ? "http://localhost:7000" : "https://refiner-api.bennynguyen.dev";

export const disiAPI = debugging ? "http://localhost:1911" : "https://api.disi.fyi";

export const web = debugging ? "http://localhost:5173" : "https://disi.fyi";

export const bannerModeList = [
  "Custom Color",
  "Custom Image Banner",
  "Discord Accent Color",
  "Discord Image Banner (Nitro User Only)",
];
