import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  site: 'https://drodol.github.io',  // The domain without the repository name
  base: '/drodolcom',  // The repository name
  integrations: [
    tailwind(),
    alpinejs(),
  ],
});
