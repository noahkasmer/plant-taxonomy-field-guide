# AGENTS

## Mission

This repository builds a practical, offline-first native plant identification and field guide app for Illinois plants using Expo, React Native, TypeScript, Expo Router, SQLite, and a legally conservative media/data pipeline.

## Architecture Rules

1. Keep the app usable offline after install and local seed import.
2. Treat SQLite as the structured local source of truth at runtime.
3. Treat bundled seed data as the canonical import source until a future remote sync pipeline exists.
4. Keep image rights stricter than factual-source rules.
5. Never render unreviewed media in the live app.
6. Prefer small composable repositories and services over large stateful utility files.

## Layering

- `src/data/`
  - Canonical bundled source data, image manifests, source transparency metadata, and license metadata.
- `src/db/`
  - SQLite client, migrations, seed/import pipeline, repositories, and row mappers.
- `src/store/`
  - Zustand state for bootstrap state, filters, favorites, recents, and user settings.
- `src/services/`
  - App-level orchestration that coordinates repositories and store updates.
- `src/components/`
  - Reusable UI primitives and field-guide-specific list/detail blocks.
- `src/screens/`
  - Route-level screens only. Keep them mostly declarative.

## Data Conventions

- All plant facts must be original paraphrases of factual references.
- All seed images must carry attribution, source, license, and review metadata.
- Import validation must fail if required image attribution metadata is missing.
- Legal source policy belongs in `LICENSE_SOURCES.md`.
- Operational media policy belongs in `IMAGE_SOURCING_POLICY.md`.
- Fuller legal and provenance guidance belongs in `LEGAL_AND_SOURCING_GUIDE.md`.

## SQLite Conventions

- Keep migrations append-only.
- Keep schema normalized.
- Use repositories for all queries instead of direct screen-level SQL.
- Seed data should be deterministic and idempotent for the current seed version.

## UI Conventions

- Optimize for one-handed field use, high contrast, and fast scanning.
- Use Tailwind-style utilities via `twrnc` for new UI work.
- Prefer large tap targets and compact, information-dense cards.
- Avoid decorative motion or visual clutter.

## Testing Conventions

- Add data validation tests for the import pipeline.
- Add SQLite migration/query tests against an in-memory SQLite database in Node.
- Add search tests for ranking and filters.

## Delivery Conventions

- Update `TODO.md` as milestones complete.
- Update `README.md` when setup steps, scripts, or architecture change.
- Document major architectural choices in `docs/ARCHITECTURE.md`.
