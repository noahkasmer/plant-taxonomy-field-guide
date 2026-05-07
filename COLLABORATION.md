# Collaboration Split

This project can be worked on by both Codex and Claude Code at the same time, but only if ownership is split by strengths and by write scope.

## Source Of Truth

- The canonical repo is [plant-taxonomy-field-guide](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide>).
- Treat the main repo as the source of truth.
- If Claude Code is used, it should work in a separate worktree or branch, not in the same checkout as Codex.

## Strength-Based Ownership

### Codex owns

Codex should own the parts of the app where correctness, integration, validation, and architecture matter most:

- data model and type contracts
- SQLite schema, migrations, seed/import logic, and repositories
- source and license policy enforcement
- bundled image provenance and asset wiring
- search/filter logic
- state/bootstrap/runtime integration
- tests, validation scripts, and docs
- final merge review and integration

Primary files and folders:

- [src/types](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/types>)
- [src/data](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/data>)
- [src/db](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/db>)
- [src/services](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/services>)
- [src/store](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/store>)
- [tests](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/tests>)
- [LICENSE_SOURCES.md](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/LICENSE_SOURCES.md>)
- [IMAGE_SOURCES.md](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/IMAGE_SOURCES.md>)
- [LEGAL_AND_SOURCING_GUIDE.md](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/LEGAL_AND_SOURCING_GUIDE.md>)

### Claude Code owns

Claude Code should own the parts where exploratory UX iteration is useful:

- identification flow UX
- field mode interaction polish
- step-by-step decision-tree UI
- identify-screen copy/layout refinement
- screen-level experimentation that stays inside the current data contract

Claude should stay primarily inside:

- [src/screens/IdentifyScreen.tsx](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/screens/IdentifyScreen.tsx>)
- [src/screens/FieldModeScreen.tsx](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/screens/FieldModeScreen.tsx>)
- any new helper components created only for those flows

Within that scope, Claude is the lead decision-maker on product and interaction direction. Codex should preserve the data/runtime contract, but defer to Claude on UX shape, flow structure, and screen-level design choices for identification.

## Hard Boundaries

Claude Code should not modify these without explicit coordination:

- [package.json](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/package.json>)
- [src/types/plant.ts](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/types/plant.ts>)
- [src/data/plants.ts](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/data/plants.ts>)
- [src/data/imageManifest.ts](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/data/imageManifest.ts>)
- [src/db](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/db>)
- [src/services](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/services>)
- [src/store](</C:/Users/noaha/Documents/New project/plant-taxonomy-field-guide/src/store>)
- source/license docs
- tests or validation scripts unless the task explicitly requires it

Codex should avoid doing broad identify-flow UX experimentation while Claude is actively owning that area.

## Runtime Rules

- Only one agent should run Metro in a given checkout at a time.
- If both agents need a dev server, use separate worktrees and separate ports.
- Do not let both agents edit the same file concurrently.
- Do not let both agents change dependencies concurrently.

## Merge Strategy

1. Claude works in a separate worktree or branch.
2. Claude keeps its scope narrow to identify/field-mode UX.
3. Claude returns a focused diff.
4. Codex reviews the diff for schema/runtime/policy conflicts.
5. Codex merges and re-runs:
   - `npm run typecheck`
   - `npm test`
   - `npm run data:validate`

## Prompt For Claude Code

Use this prompt as-is:

```text
Work only on the identification experience and field-mode UX for this repository.

Your job:
- improve the plant identification flow
- improve field-mode usability
- make the interaction feel fast, practical, and good for one-handed outdoor use

Constraints:
- do not change package.json
- do not change the database layer
- do not change SQLite schema or seed/import logic
- do not change src/types/plant.ts
- do not change src/data/plants.ts
- do not change source/license/image policy files
- do not add backend or sync work
- do not change search architecture outside the identification flow

Allowed scope:
- src/screens/IdentifyScreen.tsx
- src/screens/FieldModeScreen.tsx
- small new helper components used only by those screens

Design goals:
- large tap targets
- minimal clutter
- high contrast
- fast trait-based narrowing
- good mobile-first field usability
- keep the current plant traits and existing data contract

Before finishing:
- keep the diff focused
- avoid touching unrelated files
- summarize exactly which files you changed and why
```

## Senior-Lead Prompt For Claude Code

Use this tighter prompt when you want Claude to lead the identification UX direction at a senior level:

```text
You are the lead designer-engineer for the identification experience in this repository.

Own the product direction for:
- the step-by-step identification flow
- field-mode interaction design
- mobile-first field usability

Your task:
- turn the current identification experience into a stronger guided flow
- make it feel more like a practical field tool than a generic filter screen
- use the existing plant traits and data contract without changing the underlying architecture

Hard constraints:
- do not change package.json
- do not change SQLite, repositories, migrations, or seed/import logic
- do not change src/types/plant.ts
- do not change src/data/plants.ts
- do not change image/source/license policy files
- do not add backend or sync work

Allowed scope:
- src/screens/IdentifyScreen.tsx
- src/screens/FieldModeScreen.tsx
- small helper components used only by those flows

Design authority:
- you are the lead on UX decisions in this scope
- prefer a guided identification experience over a generic all-at-once filter UI if that improves field usability
- optimize for large tap targets, low clutter, speed, and one-handed outdoor use

Expected outcome:
- a clearer step-by-step or staged identification flow
- better field-mode ergonomics
- stronger visual hierarchy
- minimal unrelated edits

Before finishing:
- keep the diff focused to your scope
- avoid touching unrelated files
- summarize exactly which files you changed
- explain the UX rationale behind the new identification flow
```
