import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from "@astrojs/alpinejs";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://drodol.com',
  base: '/',
  output: 'server',
  adapter: cloudflare({
    mode: 'advanced',
  }),
  integrations: [
    tailwind(),
    alpinejs(),
  ],
});
