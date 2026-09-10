# NICHSEDGE

Personal portfolio built with Next.js and deployed to GitHub Pages/Cloudflare.

## Local Development (Bun)

1. Install dependencies:
   `bun install`
2. Optional: set `GEMINI_API_KEY` in `.env.local` for AI-powered API routes (`/api/ghost`, `/api/audit`).
   Without it, routes use local fallback responses.
3. Start dev server:
   `bun run dev`

## Features

- **🎮 Gamification Engine (`DATA_DEFENDER`)**: XP progression, clearance ranks, active quest registry, badge unlocks, and persistent audio feedback via Web Audio API.
- **🏎️ 3D Data Highway Arcade**: Playable Three.js minigame simulating high-throughput Kafka streams with packet collection, dodging, and score multipliers.
- **🗄️ 3D Server Rack Explorer**: Interactive 3D blade server cluster with slide-out drawers, live node metrics, and chaos failover simulations.
- **🌌 3D Knowledge Constellation**: Celestial 3D skill galaxy with gravitational attraction and tech dossier inspection.
- **⚡ 3D Laser Pipeline Router**: Photonic ETL data flow constructor with laser channels and real-time energy packet bursts.
- **🛡️ System Control Panel & Soundscape Controls**: Centralized system settings drawer with real-time theme biome switching, cognitive locale toggling, audio soundscape controls, and sensory lockdown focus mode (disabling ambient animations and environmental noise).

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

