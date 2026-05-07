# Collaboration Guide

Two agents work this repo: **Claude Code** and **Codex**. This file defines the actual working split based on what each does well, not what sounds architecturally clean.

---

## How to start a session

1. `git pull origin main`
2. Read `STATUS.md` — know what the other agent last did and what's pending
3. Work only in your lane (see below)
4. Before ending: update `STATUS.md` and push

---

## Lane: Claude Code

Claude owns anything that requires exploration, iteration, or judgment calls that are hard to specify up front.

**Primary responsibilities:**
- UX screens and components (`src/screens/`, `src/components/`)
- Field mode and identification flow design
- Image sourcing — finding, downloading, and wiring new plant photos
- Plant data entry and `src/data/plants.ts` edits
- One-off data wiring scripts (`scripts/`)
- `src/data/imageAssets.ts` and `src/data/imageManifest.ts`

**Secondary (touch only when the task requires it):**
- `src/types/plant.ts` — only to add fields needed by UI work
- `app/` routes — only for new screens Claude is building

---

## Lane: Codex

Codex owns anything that requires correctness, integration guarantees, or verifiable outputs.

**Primary responsibilities:**
- `src/db/` — SQLite client, migrations, seed/import, repositories
- `src/store/` — Zustand bootstrap and state management
- `src/services/` — app-level orchestration
- TypeScript error remediation across the codebase
- Tests and validation scripts
- Final typecheck and merge gate before releases
- `README.md`, `AGENTS.md`, architecture docs

**Secondary (touch only when the task requires it):**
- `src/types/plant.ts` — only to fix type errors it introduced
- `package.json` — only for dependency changes it owns

---

## Hard rules

- **Neither agent touches the other's primary files without flagging it in STATUS.md first.**
- **Neither agent runs `npm install` or changes `package.json` without the other knowing.**
- **Neither agent pushes without updating STATUS.md.**
- Only one agent runs Metro at a time in a given checkout.
- If both need a dev server simultaneously: separate worktrees, separate ports.

---

## Merge strategy

1. Both agents work on `main` with short-lived edits and frequent small commits.
2. Codex runs `npx tsc --noEmit` and `npm test` before any release tag.
3. If there's a conflict: Codex has final say on db/store/services, Claude has final say on screens/components/data-entry.

---

## When in doubt

Update `STATUS.md` with what you're about to do and why. The other agent will see it next session.
