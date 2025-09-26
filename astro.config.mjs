import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from "@astrojs/alpinejs";
import cloudflare from "@astrojs/cloudflare";
import rehypeAddClasses from 'rehype-add-classes';

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
  markdown: {
    rehypePlugins: [
      [rehypeAddClasses, {
        'h1': 'font-serif font-bold',
        'h2': 'font-serif font-bold',
        'h3': 'font-serif font-bold',
        'h4': 'font-serif font-bold',
        'h5': 'font-serif font-bold',
        'h6': 'font-serif font-bold'
      }]
    ]
  }
});
