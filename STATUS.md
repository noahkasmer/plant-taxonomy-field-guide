# Agent Status

Read this before starting. Update this before pushing.

---

## Last updated
2026-05-07 - Claude

---

## Recent commits on main

| Commit | Agent | What |
|--------|-------|------|
| `1a0bcce` | Claude | Two-layer hybrid ID: trait filter → seeded sub-key ⚠️ see note |
| `4bc18a8` | Claude | Phase 2: plain-language dichotomous key with inline diagrams |
| `8c9e255` | Claude | Added STATUS.md |
| `68562a3` | Claude | Black-eyed-susan slot swap; deriveBloomSeason; 17 imageSources fixes; field-browse route |
| `a2b0c71` | Claude | 88 iNat life-stage images; guided field key; tab bar to top; CC_BY image fix |

---

## Completed - Codex

- [x] `npx tsc --noEmit` is clean
- [x] Fixed DB-layer TypeScript errors in `src/db/client.ts`, `src/db/migrations.ts`, `src/db/seed.ts`, and `src/db/repositories/`
- [x] Removed the stale unused legacy storage path: `src/storage/plantDatabase.ts` and `src/hooks/usePlantRepository.ts`
- [x] Kept `PlantDetailScreen.tsx` touch scoped to the approved leaf-photo fallback card for plants missing a leaf slot image
- [x] Added minimal validation-compatibility fixes required by the current iNat image set:
  - `src/data/sources.ts` now includes `INATURALIST` in the image source catalog
  - `src/data/imageAssetKeys.ts` now matches the current bundled image registry
  - `src/utils/plants.ts` includes the `INATURALIST` source label
  - `scripts/fetch-inaturalist-stages.ts` no longer references a non-existent `commonName` field
- [x] Re-exported backend mirror data after validation changes
- [x] Added `src/services/fieldKeyService.ts` to support Phase 2 without touching Claude-owned screen/component files
  - key-node map builder with duplicate detection
  - choice-resolution helper that distinguishes node transitions from terminal plant results
  - season-branch suggestion helper for the spring vs summer/fall split in the guided key
  - reachable-node traversal helper for dataset validation

---

## Verification - Codex

- `npx tsc --noEmit` passed
- `npm run data:validate` passed
- `npm run data:export-backend` passed
- `npm run db:smoke` passed
- `npm test` passed (`9/9`)

---

## Completed - Claude

- [x] Two-layer hybrid ID flow (commit `1a0bcce`)
  - `src/utils/keyTraversal.ts`: `findSubKeyEntry` walks key tree to find first disambiguating node for a plant subset
  - `src/screens/FieldKeyScreen.tsx`: accepts `seedPlantIds` prop; starts at sub-key entry node; filters results to seed set; shows candidate count banner
  - `app/identify-key.tsx`: new route reading `seeds` query param, renders seeded `FieldKeyScreen`
  - `src/screens/FieldModeScreen.tsx`: "Still not sure?" banner appears at 2–10 matches, navigates to `/identify-key?seeds=...`
  - ⚠️ **Lane note for Codex**: `src/services/fieldKeyService.ts` was inadvertently included in this commit (it was untracked in the working tree when Claude staged files). The file itself is Codex's work and is unchanged — but Codex should verify the commit did not alter it and re-own it if needed.

- [x] Phase 2 key UX: all 31 key nodes rewritten in plain language for non-biologists
  - `src/types/dichotomousKey.ts`: added `hint?`, `diagram?: DiagramType`, `context?` fields
  - `src/components/GuidedFieldMode.tsx`: renders inline `LeafDiagram` per choice, context box below question, italic hint below label, wrapped in ScrollView
  - `src/data/dichotomousKey.ts`: all nodes have `context` explanations and most choices have `hint` text; leaf arrangement, stem, and flower form questions have inline diagrams (`opposite`, `alternate`, `basal`, `compound`, `simple`, `ray-disk`, `square-stem`)

---

## Completed - Codex (Phase 2 support)

- [x] Strengthened `tests/data/dichotomousKey.test.ts` so the current guided key now verifies:
  - all nodes remain reachable from `ROOT_NODE_ID`
  - season-branch helpers map months into the current spring vs summer/fall split
  - key-choice resolution correctly distinguishes node hops from terminal result lists

---

## Pending - Claude

- [ ] Visual audit of iNat image slots across all 31 plants (only black-eyed-susan was user-verified; others were annotated by iNat phenology and not hand-checked)
- [ ] Decide whether the current top-tab layout should stay as-is on Android after device review

---

## Known issues / watch out for

- `blue-vervain` and `ironweed` still have no bundled leaf-slot image; `PlantDetailScreen` now shows a fallback card instead of failing silently
- `obedient-plant` still has no bundled leaf-slot image; same fallback applies
- `README.md`, `TODO.md`, `src/screens/IdentifyScreen.tsx`, `backend/data/licenses.json` still have uncommitted local edits — not part of any agent commit yet
- `src/services/fieldKeyService.ts` was swept into Claude's commit `1a0bcce` — Codex should verify file integrity
- `npm test` can throw `spawn EPERM` inside the restricted sandbox on this Windows setup; use the normal repo validation command outside the sandbox when that happens before treating it as a real test failure
