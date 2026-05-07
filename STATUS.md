# Agent Status

Short-lived file. Each agent updates this when it lands work or passes something off.
Read it before starting a session. Update it before ending one.

---

## Last updated
2026-05-07 — Claude Code

---

## What just landed (main, pushed)

| Commit | What |
|--------|------|
| `a2b0c71` | 88 iNat life-stage images + 12 Wikimedia heroes bundled; `canUseImageInCommercialApp` fixed for CC_BY/CC_BY_SA; guided dichotomous key field mode (`FieldKeyScreen`); tab bar moved to top |
| `68562a3` | Black-eyed-susan detail/fruit slots swapped (user-verified); `deriveBloomSeason` added to `createPlant` (no more bloomSeason TS errors); 17 plants had `INATURALIST` missing from `imageSources` — fixed; `field-browse` route added for trait-chip fallback |

---

## In progress / handed to Codex

- **`bloomSeason` cleanup** — `createPlant` now auto-derives it; ~31 plants have redundant explicit `bloomSeason` values in their definitions that are overridden at runtime. Safe to strip or leave. Low priority.
- **Pre-existing db-layer TS errors** — `src/db/client.ts`, `src/db/migrations.ts`, `src/storage/plantDatabase.ts` have expo-sqlite API mismatches and a missing `identifyingFeatures` field. Not blocking the web preview but will matter on native.
- **3 missing leaf slots** — `blue-vervain`, `obedient-plant`, `ironweed` had no CC-BY leaf photo on iNaturalist. Currently just missing. A fallback UI card would be nice.

---

## Known image issues to verify visually

- Slot mismatch was confirmed for black-eyed-susan (fixed). Other plants' detail/fruit/leaf slots were fetched by iNat phenology annotation and not hand-verified. A visual pass through the app is recommended.
- `blue-vervain` and `ironweed` each have only a `detail` iNat image (fruit was the same photo, skipped by wire script).

---

## Hard boundaries reminder

- Claude Code: stay out of `src/db/`, `src/store/`, `src/services/`, `src/types/plant.ts` unless explicitly coordinated
- Codex: defer to Claude on UX shape inside `src/screens/` and `src/components/`
- Neither agent: touch `package.json` or run `npm install` without coordination
