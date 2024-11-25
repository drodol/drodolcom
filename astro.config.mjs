import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  site: 'https://drodol.com',  // Your custom domain
  base: '/',  // No subdirectory needed for custom domain
  integrations: [
    tailwind(),
    alpinejs(),
  ],
});
