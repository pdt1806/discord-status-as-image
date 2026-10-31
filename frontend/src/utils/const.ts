export const debugging = import.meta.env.DEV;

const isPlaywrightServer = window.__PLAYWRIGHT_SERVER__;

export const refinerAPI = isPlaywrightServer
  ? "http://host.docker.internal:8010"
  : import.meta.env.VITE_REFINER_API;

export const disiAPI = isPlaywrightServer
  ? "http://localhost:1911"
  : import.meta.env.VITE_DISI_API;

export const web = import.meta.env.VITE_WEB;

export const R2_BUCKET = import.meta.env.VITE_R2_BUCKET;
