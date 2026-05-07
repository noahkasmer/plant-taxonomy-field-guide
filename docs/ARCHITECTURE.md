# Architecture

## Overview

The app is an offline-first Expo Router application backed by a local SQLite catalog. Bundled seed data in `src/data/` is imported into SQLite during bootstrap. UI reads from the hydrated store and repository layer rather than directly from the seed files.

## Architectural goals

- offline-first field usability
- fast local search and filtering
- legally conservative factual and image sourcing
- small modular service boundaries
- deterministic seed/import behavior

## Layers

### Routes and screens

- `app/` defines Expo Router routes and tab structure.
- `src/screens/` contains route-level screens only.
- Screens should stay mostly declarative and call store selectors plus service actions.

### UI components

- `src/components/` holds reusable cards, chips, buttons, search inputs, empty states, attribution blocks, and offline indicators.
- New UI work uses `twrnc` utilities plus the shared palette/theme helpers.

### Canonical data

- `src/data/plants.ts` is the canonical bundled plant seed source.
- `src/data/sources.ts` and `src/data/licenses.ts` define reviewable provenance catalogs.
- `src/data/imageManifest.ts` tracks reviewed image candidates.
- `src/data/imageAssetKeys.ts` separates metadata keys from runtime asset imports so validation scripts can run in Node without loading image binaries.

### Database

- `src/db/client.ts` opens the Expo SQLite database and handles reset operations.
- `src/db/migrations.ts` contains append-only schema migrations.
- `src/db/seed.ts` imports the canonical seed data into normalized tables.
- `src/db/repositories/` contains query-focused modules for catalog, settings, and user data.

### Services

- `src/services/bootstrapApp.ts` runs migrations, checks the seed version, and hydrates the Zustand store.
- `src/services/searchService.ts` implements local query scoring and filter matching.
- `src/services/userActions.ts` handles favorites, recents, theme persistence, cache clearing, and offline reset actions.

### State

- `src/store/appStore.ts` is the runtime store for:
  - bootstrap status
  - plant summaries and details
  - active filters and filter options
  - favorites
  - recently viewed plants
  - theme preference
  - catalog statistics

## Bootstrap sequence

1. `app/_layout.tsx` mounts the root shell.
2. `initializeAppAsync()` opens SQLite.
3. Migrations are applied.
4. The stored seed version is checked against `SEED_VERSION`.
5. If needed, the database is reseeded from `src/data/`.
6. Plant details, summaries, filter options, favorites, recents, theme preference, and stats are loaded.
7. The Zustand store is hydrated and the app shell renders normal navigation.

## Search architecture

Search runs fully on-device against hydrated plant summaries.

The search service combines:

- exact matches
- prefix matches
- contains matches
- synonym matches
- fuzzy subsequence scoring
- token hits inside descriptive text

Filters are applied before final ranking. Current filters include:

- flower colors
- bloom months
- habitats
- plant types
- native statuses
- families

## SQLite schema

The normalized schema currently includes:

- `plants`
- `plant_fact_sources`
- `habitats`
- `plant_habitats`
- `bloom_periods`
- `tags`
- `plant_tags`
- `attributions`
- `images`
- `reviewed_image_candidates`
- `synonyms`
- `similar_species`
- `favorites`
- `recently_viewed`
- `settings`
- `sources`
- `licenses`
- `app_meta`
- `schema_migrations`

The database is intended to be the runtime source of truth after bootstrap, while bundled seed files remain the editorial source of truth during the current MVP phase.

## Legal and provenance architecture

- Facts and images use separate provenance paths.
- Fact summaries store source references plus a summary method indicator.
- Images store source, attribution, license, review, and commercial-use metadata.
- Runtime image rendering is intentionally stricter than the raw model.
- Validation rejects missing attribution/license metadata for imported media records.

## Optional backend mirror

`backend/` is a read-only Node HTTP service that mirrors exported seed data from the canonical frontend dataset. It exists to prepare for future sync/API work without changing the current offline-first runtime contract.

Current backend endpoints:

- `GET /api/health`
- `GET /api/plants`
- `GET /api/plants/:id`
- `GET /api/reviewed-image-candidates`
- `GET /api/reviewed-image-candidates/:plantId`
- `GET /api/sources`
- `GET /api/licenses`

## Testing strategy

- `tests/data/` validates seed data completeness and provenance integrity
- `tests/search/` verifies search behavior and ranking/filter logic
- `tests/db/` verifies migrations and seed behavior against a Node SQLite test harness

## Near-term follow-up work

- add more reviewed bundled images
- add richer field-guide content depth for all plants
- add true initial downloadable content packages if the catalog grows
- add range maps and stronger similar-species editorial relationships
- consider background sync only after the offline contract is stable
