# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `npm start` - starts Astro dev server
- **Build**: `npm run build` - builds the site for production (includes image sync)
- **Build (CI)**: `npm run build:ci` - builds without image sync for CI environments
- **Preview**: `npm run preview` - preview production build locally
- **Format code**: `npx prettier --write .` - format code using Prettier
- **Image sync**: `npm run sync-images` - syncs images from Obsidian vault to public directory

## Architecture

This is an Astro-based personal website/blog deployed to Cloudflare Pages with the following key characteristics:

### Stack
- **Framework**: Astro v5 with static output (`output: 'static'`)
- **Deployment**: Cloudflare Pages (not Workers)
- **Styling**: TailwindCSS with custom Medium-inspired design system
- **Interactivity**: Alpine.js for client-side interactions
- **Content**: Astro Content Collections for blog posts (Markdown)
- **Node.js**: Requires v20.3.0+ (specified in package.json engines and .nvmrc)

### Key Design Patterns

**Medium-Inspired Design System**: Custom TailwindCSS configuration defines a clean, readable design with:
- Custom colors: `medium-bg`, `medium-text`, `medium-text-secondary`, `medium-accent`, `medium-hover`, `medium-border`
- Typography: Instrument Serif for headings, system fonts for body text
- Custom typography scale: `medium-large`, `medium-h1`, `medium-h2`, `medium-body`, `medium-small`
- Custom layout widths: `medium` (680px), `medium-wide` (728px)

**Static Site Generation**: All pages are pre-rendered at build time for optimal performance on Cloudflare Pages.

**Content Collections**: Blog posts are managed via Astro's content collections in `src/content/blog/` with TypeScript schema validation for frontmatter (title, description, pubDate, tags, draft status, etc.).

**Consistent Styling**: All pages (homepage, blog, about, now, uses, contact) use the same Medium-inspired utility classes instead of prose classes to ensure visual consistency.

### Local Development Workflow

**Image Synchronization**: The `sync-images.js` script automatically syncs images from a local Obsidian vault (`/Users/dave/2025 Vault/drodol.com Blog/images`) to the project's `public/images` directory. This script:
- Runs automatically during `npm run build` for local development
- Skips execution in CI environments (detects `CF_PAGES` or `CI` environment variables)
- Only syncs files that have been modified (checks modification timestamps)

### Deployment Configuration

**Cloudflare Pages**:
- `wrangler.toml` configures the project name and build output directory
- Automatic deployments from GitHub main branch
- Static assets served from `./dist` directory
- Node.js version controlled by `.nvmrc` file (v20.18.1)

**Build Process**:
- Local builds include image sync from Obsidian vault
- CI builds skip image sync to avoid permission errors
- All builds produce static HTML/CSS/JS in `dist/` directory

### Content Management

**Blog Posts**: Located in `src/content/blog/` as Markdown files with frontmatter schema validation. The content collection schema requires:
- `title` (string)
- `description` (string)
- `pubDate` (date)
- Optional: `updatedDate`, `heroImage`, `tags`, `draft` status

**Analytics**: Integrated with Plausible Analytics at `plausible.drodol.com` for privacy-focused website analytics.

### Styling Guidelines

When working on this codebase:
- Use Medium-inspired utility classes (`text-medium-text`, `text-medium-body`, etc.) instead of prose classes
- Headings should use `font-serif` class to apply Instrument Serif font
- Maintain consistent spacing with `space-y-6` and `space-y-8` for sections
- Links should use `text-medium-accent hover:underline font-medium` for consistency
- Background cards should use `bg-medium-hover` instead of gray colors