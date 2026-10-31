/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REFINER_API: string;
  readonly VITE_DISI_API: string;
  readonly VITE_WEB: string;
  readonly VITE_R2_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
