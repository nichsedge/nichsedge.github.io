# AGENTS.md — Guidelines for Autonomous Coding Agents

> Repository guidelines for autonomous agents, AI assistants, and LLM development tools working on `nichsedge.github.io`.

## Repository Architecture
- **Framework**: Next.js (App Router) with React 19 and TypeScript.
- **Styling**: Tailwind CSS v4 with custom cyber/terminal themes and font systems (Geist, JetBrains Mono).
- **Static Export**: Built with `bun run build:pages` emitting static HTML to `./out` for GitHub Pages deployment.
- **Graphics / 3D**: Three.js, Recharts, Lucide React icons, and Web Audio API synthesis.

## Agent Guidelines & Standards
1. **Zero Legacy Shims**: Use modern ES modules and current Next.js App Router idioms. Avoid deprecated wrappers or legacy fallbacks.
2. **Deterministic Builds**: Always test using Bun:
   ```bash
   bun run lint
   bun run typecheck
   bun run build
   ```
3. **Agentic Protocol Alignment**:
   - Keep `.well-known/` manifests in sync with `public/.well-known/`.
   - Ensure all public REST endpoints emit RFC 7807 compliant error payloads.
   - Maintain `openapi.json`, `auth.md`, `pricing.md`, and `llms.txt`.
4. **Content Ratio**: Maintain high semantic content density in page templates to support assistive technologies and automated agent extractors.

## Key Entry Points
- Root Layout: `app/layout.tsx`
- Home Page: `app/page.tsx` & `app/home-client.tsx`
- Developer Portal: `app/developers/page.tsx`
- OpenAPI Specification: `public/openapi.json`
- Agent Card: `public/.well-known/agent-card.json`
