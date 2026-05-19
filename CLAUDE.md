# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@claude-docs/AGENTS.md

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

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. The app runs in degraded mode without them (auth/data features disabled).

### Path alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Shared docs

`claude-docs/` — shared reference files for AI agents (e.g. `DESIGN.md`). New shared documents should be placed here.

### Language

UI text is in Korean. Code identifiers are in English.

---

## Behavioral Guidelines

> Karpathy-inspired rules to reduce common LLM coding mistakes. Tradeoff: biases toward caution over speed.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```
