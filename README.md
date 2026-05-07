# plant-taxonomy-field-guide

Offline-first Expo field guide MVP for identifying and browsing common native Illinois plants on iPhone, Android, and web.

## What is in this MVP

- Expo Router app with tab navigation for Home, Search, Favorites, Field Mode, and Settings
- Local SQLite runtime with normalized plant, habitat, tag, attribution, synonym, favorite, and recent-view tables
- Seeded catalog of 31 Illinois plants with original paraphrased fact summaries
- Guided dichotomous-key identification flow with glossary diagrams and optional high-contrast focus mode
- Fast local search across common name, scientific name, family, synonyms, and descriptive text
- Filterable browse experience for flower color, bloom month, habitat, plant type, family, and native status
- Field Mode screen with high-contrast, large-tap trait filtering
- Favorites and recently viewed tracking stored locally
- Legally conservative image pipeline with attribution, license, and review metadata
- Optional read-only backend mirror for future sync/API work

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Expo app:

```bash
npm run start
```

3. Optional shortcuts:

```bash
npm run android
npm run ios
npm run web
```

4. Optional: start the read-only backend mirror:

```bash
npm run server
```

The app is designed to remain usable offline after the initial bundled seed load. The local SQLite database is bootstrapped from `src/data/` on first run or when the seed version changes.

## Tooling scripts

```bash
npm run typecheck
npm run test
npm run data:validate
npm run data:export-backend
npm run db:smoke
```

- `typecheck`: TypeScript verification
- `test`: data validation, search behavior, and SQLite seed/query tests
- `data:validate`: validates plant, source, license, attribution, and image metadata
- `data:export-backend`: exports the canonical frontend seed data into `backend/data/`
- `db:smoke`: runs migrations and seed logic in a Node smoke test

## App architecture

### Runtime flow

1. `app/_layout.tsx` boots the app shell.
2. `src/services/bootstrapApp.ts` opens SQLite, runs migrations, checks the seed version, and seeds when needed.
3. `src/store/appStore.ts` hydrates plant summaries, detailed records, filter options, favorites, recents, theme preference, and stats.
4. Screens render from the hydrated local store rather than from direct file reads.

### Main screens

- `Home`: launch point, stats, favorites preview, recent plants
- `Identify`: guided step-by-step key with glossary support and an optional high-contrast focus mode
- `Search`: fuzzy local search with filter chips and filter modal
- `Favorites`: locally stored bookmarks
- `Field Mode`: high-contrast identification workflow
- `Settings`: theme, offline data reset, cache management, transparency links
- `Plant Detail`: field traits, descriptions, similar species, reviewed images, attribution, and source transparency
- `About`: source transparency page
- `Licenses`: allowed-license and attribution guidance page

## Repository structure

```text
app/                     Expo Router routes
assets/images/           Bundled reviewed image assets
backend/                 Optional read-only API mirror
scripts/                 Validation/export/smoke-test scripts
src/components/          Reusable UI building blocks
src/data/                Canonical bundled seed data and metadata catalogs
src/db/                  SQLite client, migrations, seed logic, repositories
src/hooks/               Theme and UI hooks
src/screens/             Route-level screen components
src/services/            Bootstrap, search, and user action orchestration
src/store/               Zustand app store
src/theme/               Palette and Tailwind-style helpers
src/types/               Shared domain types
src/utils/               Formatting, rights, and validation helpers
tests/                   Node-based validation, search, and SQLite tests
```

## Data and legal model

- Facts are stored as original paraphrases derived from factual references.
- Images require explicit source, license, attribution, and review metadata.
- Live app image rendering is stricter than the schema: only commercially safe, reviewed assets are displayed.
- Import validation fails when required attribution metadata is missing.

## Optional backend

The app does not require a backend to function. `backend/` exists as a small read-only mirror of the canonical seed dataset so the project can evolve toward sync or remote APIs later without changing the current offline-first architecture.

## Documentation

- [AGENTS.md](./AGENTS.md): repo conventions and architecture rules
- [TODO.md](./TODO.md): build status and remaining follow-up items
- [IMAGE_SOURCES.md](./IMAGE_SOURCES.md): bundled image inventory with source URLs, license, and review status
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): application and data architecture
- [LICENSE_SOURCES.md](./LICENSE_SOURCES.md): allowed license/source policy
- [IMAGE_SOURCING_POLICY.md](./IMAGE_SOURCING_POLICY.md): operational image review checklist
- [LEGAL_AND_SOURCING_GUIDE.md](./LEGAL_AND_SOURCING_GUIDE.md): longer-form legal and provenance guidance
