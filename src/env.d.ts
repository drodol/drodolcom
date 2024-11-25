/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BLUESKY_USERNAME: string;
  readonly BLUESKY_APP_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Runtime {
  env: {
    BLUESKY_USERNAME: string;
    BLUESKY_APP_PASSWORD: string;
  };
}

declare namespace App {
  interface Locals {
    runtime?: Runtime;
  }
}