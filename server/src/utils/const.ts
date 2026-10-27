import "../config";

export const debugging = process.env.NODE_ENV === "development";

export const web = debugging
  ? (process.env.DISI_WEB_URL_DEVELOPMENT ?? "http://localhost:5173")
  : (process.env.DISI_WEB_URL_PRODUCTION ?? "https://disi.fyi");

export const origins = (
  process.env.DISI_CORS_ORIGINS ??
  "https://disi.bennynguyen.dev,https://disi.fyi"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ---------------------------------------------

export const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--disable-gpu",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
  "--headless",
  "--disable-web-security",
  "--allow-running-insecure-content",
];

export const lowercase_and_number = "abcdefghijklmnopqrstuvwxyz0123456789";
