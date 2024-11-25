/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BLUESKY_USERNAME: string;
  readonly BLUESKY_APP_PASSWORD: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}