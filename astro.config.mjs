import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  site: 'https://drodol.com',  // Replace with your domain or GitHub Pages URL
  base: '/',
  integrations: [
    tailwind(),
    alpinejs(),
  ],
});
