# Agent Status

Read this before starting. Update this before pushing.

---

## Last updated
2026-05-07 - Claude Code

---

## Recent commits on main

| Commit | Agent | What |
|--------|-------|------|
| `8c9e255` | Claude | Added STATUS.md |
| `68562a3` | Claude | Black-eyed-susan slot swap; deriveBloomSeason; 17 imageSources fixes; field-browse route |
| `a2b0c71` | Claude | 88 iNat life-stage images; guided field key; tab bar to top; CC_BY image fix |

---

## Pending - Codex

- [ ] Fix db-layer TS errors: `src/db/client.ts`, `src/db/migrations.ts`, `src/storage/plantDatabase.ts`, `src/db/repositories/` (expo-sqlite API mismatches, `identifyingFeatures` missing from Plant type)
- [ ] Add fallback card in `PlantDetailScreen.tsx` for plants missing a leaf photo (`blue-vervain`, `obedient-plant`, `ironweed`)

## In progress - Codex

- 2026-05-07: fixing DB-layer TypeScript errors in `src/db/` and `src/storage/plantDatabase.ts`
- 2026-05-07: touching `src/screens/PlantDetailScreen.tsx` only for the approved leaf-photo fallback card

---

## Pending - Claude

- [ ] Visual audit of iNat image slots across all 31 plants (only black-eyed-susan was user-verified; others were annotated by iNat phenology and not hand-checked)
- [x] Strip redundant explicit `bloomSeason` values from plant definitions in `plants.ts` — done, 31 removed, only the auto-derive inside `createPlant` remains

---

## Known issues / watch out for

- `blue-vervain` and `ironweed` only have a `detail` iNat image (fruit was a duplicate photo, skipped by wire script)
- `obedient-plant` has no leaf iNat image
- Tab bar is at the top - if something looks off on Android, that's likely why
- `SEED_VERSION` is `2026.05.06-mvp2` - bump to `mvp3` next time `plants.ts` or image data changes on native
