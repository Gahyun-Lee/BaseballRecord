# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test framework is configured.

## Architecture

KBO baseball web app (Korean Baseball Organization) — Next.js 16 App Router with Supabase auth/database, styled with Tailwind CSS v4. Mobile-first layout capped at `max-w-lg`.

### Key layers

- **Pages** (`src/app/`): App Router pages organized by feature — `/games`, `/records`, `/stadiums`, `/mypage`, `/login`
- **Layout** (`src/components/layout/`): Shared `Header` and bottom `Navbar`
- **Supabase clients** (`src/lib/supabase/`): Separate browser (`client.ts`) and server (`server.ts`) clients using `@supabase/ssr`
- **Middleware** (`src/proxy.ts`): Auth session refresh + redirect for protected routes (`/mypage`). Gracefully skips when Supabase env vars are not configured.
- **Types** (`src/types/index.ts`): All domain types — `Game`, `TeamRecord`, `PlayerRecord`, `Stadium`, `DirectObservation`, `UserProfile`, etc. Team names use the `KboTeam` union type (Korean names + acronyms).
- **Constants** (`src/utils/constants.ts`): KBO team colors, logos, and stadium data

### Database

Supabase with two tables (see `supabase/schema.sql`):
- `profiles` — created automatically via trigger on user signup
- `observations` — user game attendance records

Both tables have RLS policies restricting access to the owning user.

### Environment

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`). The app runs in degraded mode without them (auth/data features disabled).

### Path alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Shared docs

`claude-docs/` — shared reference files for AI agents (e.g. `DESIGN.md`). New shared documents should be placed here.

### Language

UI text is in Korean. Code identifiers are in English.
