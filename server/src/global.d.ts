export {};

declare global {
  interface Window {
    __PLAYWRIGHT_SERVER__?: boolean;
    refreshDiscordStatus?: () => Promise<void>;
  }
}
