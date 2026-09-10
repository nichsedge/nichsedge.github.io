# NICHSEDGE

Personal portfolio and data engineering archive built with Next.js and deployed to GitHub Pages and Cloudflare.

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
- **🗄️ 3D Server Rack Explorer**: Interactive 3D blade server cluster with slide-out drawers, node metrics, and chaos failover simulations.
- **🌌 3D Knowledge Constellation**: Celestial 3D skill galaxy with gravitational attraction and tech dossier inspection.
- **⚡ 3D Laser Pipeline Router**: Photonic ETL data flow constructor with laser channels and real-time energy packet bursts.
- **🛡️ System Control Panel & Soundscape Controls**: Centralized system settings drawer with real-time theme biome switching, cognitive locale toggling, audio soundscape controls, and sensory lockdown focus mode.
- **🤖 Autonomous Agent Readiness (Ora.ai / AX Protocol)**:
  - **Agentic Resource Discovery (ARD)**: Published at `/.well-known/ard.json`
  - **A2A Agent Card & Skills Catalog**: `/.well-known/agent-card.json` and `/.well-known/agent-skills/index.json`
  - **WebMCP Integration**: In-browser tool invocation with `document.modelContext.registerTool` and declarative `<form toolname="...">` tags
  - **OpenAPI 3.1 Specification**: Comprehensive typed schema at `/openapi.json`
  - **RFC Standards**: RFC 9727 API catalog (`/.well-known/api-catalog`), RFC 9728 protected resource metadata, and RFC 8414 authorization server metadata
  - **Developer Portal & Sandbox**: Live endpoint testing and documentation at `/developers`
  - **Machine-Readable Markdown**: `/auth.md` (WorkOS spec), `/pricing.md`, `/index.md`, and `/llms.txt`

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
