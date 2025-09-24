# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `npm start` - starts Astro dev server
- **Build**: `npm run build` - builds the site for production
- **Preview**: `npm run preview` - preview production build locally
- **Format code**: `npx prettier --write .` - format code using Prettier

## Architecture

This is an Astro-based personal website/blog deployed to Cloudflare Workers with the following key characteristics:

### Stack
- **Framework**: Astro v4 with SSR enabled (`output: 'server'`)
- **Deployment**: Cloudflare Workers (advanced mode)
- **Styling**: TailwindCSS with custom neomorphism design system
- **Interactivity**: Alpine.js for client-side interactions
- **Content**: Astro Content Collections for blog posts (Markdown)
- **External APIs**: Bluesky AT Protocol integration

### Key Design Patterns

**Neomorphism Design System**: Custom TailwindCSS configuration defines a retro-futuristic design with:
- Custom colors: `neo-bg`, `neo-black`, `neo-accent`, `neo-white`
- Custom shadow: `neo` shadow for neomorphic effects
- Fonts: VT323 (mono) and Space Grotesk (sans)
- Custom animations: fade-in variants

**Hybrid Rendering**: Server-side rendering with client-side hydration for dynamic content like Bluesky posts.

**Content Collections**: Blog posts are managed via Astro's content collections in `src/content/blog/` with TypeScript schema validation.

### External Integrations

**Bluesky Integration**:
- API endpoint at `/api/latest-post.json.ts` fetches latest post using AT Protocol
- Requires environment variables: `BLUESKY_USERNAME` and `BLUESKY_APP_PASSWORD`
- Client-side component `BlueskyPost.astro` dynamically renders the latest post
- Deployment uses Cloudflare Workers environment variables and secrets

### Deployment Configuration

**Cloudflare Workers**:
- `wrangler.toml` configures production environment
- Static assets served from `./dist` bucket
- Environment variables set via `[vars]` section or Wrangler secrets for sensitive data

**Environment Variables**:
- `BLUESKY_USERNAME` - set in wrangler.toml
- `BLUESKY_APP_PASSWORD` - set via `wrangler secret put BLUESKY_APP_PASSWORD`