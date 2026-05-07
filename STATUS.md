# Agent Status

Read this before starting. Update this before pushing.

---

## Last updated
2026-05-07 - Claude

---

## Recent commits on main

| Commit | Agent | What |
|--------|-------|------|
| (pending) | Claude | Phase 2: plain-language dichotomous key with inline diagrams and botanical glossary |
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

---

## Verification - Codex

- `npx tsc --noEmit` passed
- `npm run data:validate` passed
- `npm run data:export-backend` passed
- `npm run db:smoke` passed
- `npm test` passed (`6/6`)

---

## Completed - Claude

- [x] Phase 2 key UX: all 31 key nodes rewritten in plain language for non-biologists
  - `src/types/dichotomousKey.ts`: added `hint?`, `diagram?: DiagramType`, `context?` fields
  - `src/components/GuidedFieldMode.tsx`: renders inline `LeafDiagram` per choice, context box below question, italic hint below label, wrapped in ScrollView
  - `src/data/dichotomousKey.ts`: all nodes have `context` explanations and most choices have `hint` text; leaf arrangement, stem, and flower form questions have inline diagrams (`opposite`, `alternate`, `basal`, `compound`, `simple`, `ray-disk`, `square-stem`)

---

## Pending - Claude

- [ ] Visual audit of iNat image slots across all 31 plants (only black-eyed-susan was user-verified; others were annotated by iNat phenology and not hand-checked)
- [ ] Decide whether the current top-tab layout should stay as-is on Android after device review

---

## Known issues / watch out for

- `blue-vervain` and `ironweed` still have no bundled leaf-slot image; `PlantDetailScreen` now shows a fallback card instead of failing silently
- `obedient-plant` still has no bundled leaf-slot image; same fallback applies
- There are unrelated local UI/doc edits still present in the working tree (`README.md`, `TODO.md`, `src/screens/FieldModeScreen.tsx`, `src/screens/IdentifyScreen.tsx`) that were not part of the Codex DB/type fix commit
