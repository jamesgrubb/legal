# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (`localhost:4321`) |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Astro CLI help |
| `npm run astro check` | Type-check `.astro` files |

No test runner is currently configured.

## Architecture

- **Framework:** Astro 5 (minimal starter)
- **Deployment:** Cloudflare Workers + Assets via `@astrojs/cloudflare` adapter and `wrangler`
- **TypeScript:** Strict mode (`astro/tsconfigs/strict`)

### Routing

Pages live in `src/pages/`. Each `.astro` (or `.md`) file becomes a route based on its filename — no router config needed. The only page today is `src/pages/index.astro`.

### Cloudflare deployment

- `astro.config.mjs` sets the Cloudflare adapter; keep this in place.
- `wrangler.jsonc` points at `dist/_worker.js/index.js` (emitted by the Cloudflare adapter during `npm run build`). The `assets.directory` is `./dist`.
- `public/.assetsignore` excludes `_worker.js` and `_routes.json` from the static asset binding so Cloudflare routes requests to the worker correctly. If you add server-side routes (API endpoints, SSR pages), do **not** remove this file.
- Environment variables go in `.env` (already gitignored). Access them via `import.meta.env` in Astro files or via `env` bindings in Cloudflare.

### Where to put things

| What | Where |
|---|---|
| Pages / routes | `src/pages/` |
| Reusable components | `src/components/` (create as needed) |
| Shared layouts | `src/layouts/` (create as needed) |
| Static assets (images, fonts) | `public/` |
| Source-imported assets (processed by Astro) | `src/assets/` (create as needed) |
