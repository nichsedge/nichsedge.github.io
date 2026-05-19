# NICHSEDGE

Personal portfolio built with Next.js and deployed to GitHub Pages/Cloudflare.

## Local Development (Bun)

1. Install dependencies:
   `bun install`
2. Optional: set `GEMINI_API_KEY` in `.env.local` for AI-powered API routes (`/api/ghost`, `/api/audit`).
   Without it, routes use local fallback responses.
3. Start dev server:
   `bun run dev`

## Quality Checks

Run full validation before opening a PR:

`bun run check`

This runs:
- `bun run lint`
- `bun run typecheck`
- `bun run build`

## Build for Static Pages

To generate static output in `out/`:

`bun run build:pages`
