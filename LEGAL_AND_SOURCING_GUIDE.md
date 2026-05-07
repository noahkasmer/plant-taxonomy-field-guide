# Legal and Sourcing Guide

This document is the repository-level guidance for plant facts, image rights, attribution, and provenance handling in `plant-taxonomy-field-guide`.

It is written to match the current codebase, which now has:

- a frontend dataset under `src/data/`
- bundled local images under `assets/images/`
- media-rights helpers under `src/utils/`
- a read-only backend mirror under `backend/data/`

This is practical engineering guidance, not legal advice.

## Current source of truth

Right now, the canonical application dataset is still the frontend dataset:

- `src/data/plants.ts`
- `src/data/imageManifest.ts`
- `src/data/imageAssets.ts`

The backend currently mirrors that data in:

- `backend/data/plants.json`
- `backend/data/reviewed-image-candidates.json`

Until the project explicitly migrates to a backend- or SQLite-first model, update the frontend source of truth first and keep the backend mirror in sync.

The current backend is intentionally read-only. It exists to support a future API or SQLite migration without changing the app's default offline-first behavior today.

## Core principles

1. Keep the app offline-first.
2. Treat facts separately from copyrighted expression.
3. Review images asset-by-asset.
4. Keep provenance fields complete and explicit.
5. Prefer conservative commercial-safe image rules by default.

## Facts and text

Facts such as:

- common names
- scientific names
- family/genus/species
- habitats
- bloom season
- field traits
- broad ecological notes

are generally usable as facts. What is not automatically reusable is the exact wording from third-party websites.

Repository rules for plant facts:

- Summarize facts in original wording.
- Keep `factSummaryMethod` as `manual_paraphrase` unless the model changes intentionally.
- Keep `factSources` populated with the real references used.
- Use `factSourceNotes` to clarify that the app uses referenced facts, not copied source text.
- Avoid long verbatim descriptions from third-party sites.

In practice, this means:

- paraphrase Illinois Wildflowers, USDA, or similar references
- cite them in the data model
- do not paste their descriptive paragraphs into the app

## Image rights policy

The live app should remain more conservative about images than about facts.

The current code enforces this through:

- `src/types/plant.ts`
- `src/utils/mediaRights.ts`
- `src/components/Attribution.tsx`
- `src/data/imageManifest.ts`

The repo currently distinguishes between:

- `license`
- `licenseStatus`
- `commercialUseReviewed`
- `source`
- `originalUrl`
- `photographer`
- `creditLine`
- `publicDomainBasis`

### Baseline rule

An image is only generally usable when:

- `licenseStatus === 'verified'`
- and the license is acceptable under the app rules

### Commercial-safe rule

For live commercial-safe display in the app, the current rule is stricter:

- only use `PUBLIC_DOMAIN` or `CC0`
- require `commercialUseReviewed === true`
- keep source and attribution metadata
- prefer approved government or public-domain source families

This is intentionally stricter than the broadest legally arguable position.

## Approved source families

The repo currently recognizes these image source families:

- `USFWS_LIBRARY`
- `NPS`
- `USDA`
- `LIBRARY_OF_CONGRESS`
- `WIKIMEDIA_COMMONS`

These are enumerated in `src/types/plant.ts`.

Preferred practical order:

1. U.S. Fish and Wildlife Service Library public-domain media
2. National Park Service media explicitly marked public domain
3. USDA media explicitly marked public domain or otherwise clearly public-domain under agency policy
4. Library of Congress public-domain material
5. Wikimedia Commons as a reviewed fallback

Do not assume a whole site is reusable just because some material on it is public domain. Review the specific asset page whenever possible.

## Bundled versus remote images

The app should not depend on third-party runtime image URLs for live display.

Current intended behavior:

- review candidate assets first
- record them in `src/data/imageManifest.ts`
- download and bundle approved files into `assets/images/plants/`
- register the local asset in `src/data/imageAssets.ts`
- display the bundled local image in the app

The frontend may still store `url` and `originalUrl` as provenance, but the preferred live path is the bundled local asset.

## Attribution

Use the existing attribution helper:

- `src/utils/mediaRights.ts`

and UI component:

- `src/components/Attribution.tsx`

Attribution should include, when available:

- photographer
- source organization/platform
- license
- original URL
- review status context

For government-origin images, follow the requested or customary credit format when one exists.

## Source-specific cautions

### U.S. Fish and Wildlife Service

- Do not assume all content on the site is public domain.
- Prefer media pages that explicitly identify public-domain status.
- Credit the photographer or creator and USFWS when requested or customary.
- Do not use protected logos or insignia as general app assets.

### USDA

- USDA states that most information on its site is considered public domain unless otherwise noted.
- Still review the specific asset when possible.
- Preserve photographer credit, such as `Photo by [name], USDA ARS`, when available.

### National Park Service

- Do not treat all NPS-hosted images as interchangeable.
- Check the specific image or gallery page for status.
- Only bundle assets with clear public-domain or otherwise approved status.

### Wikimedia Commons

- Treat it as a distribution platform, not a license shortcut.
- Review the specific file page.
- Confirm the actual rights statement on that file.
- Preserve the photographer and original release context in the manifest.

## Current repo workflow

When adding or updating a plant entry:

1. Update `src/data/plants.ts`.
2. Keep the fact summary in original wording.
3. Set `factSources`, `factSourceNotes`, and `lastVerified`.
4. If image candidates are being reviewed, record them in `src/data/imageManifest.ts`.
5. If a reviewed asset is bundled locally, register it in `src/data/imageAssets.ts`.
6. Mirror the data into `backend/data/` until backend storage becomes canonical.

When updating policy-sensitive code:

1. Keep `src/types/plant.ts` aligned with the provenance model.
2. Keep `src/utils/mediaRights.ts` aligned with the live display rules.
3. Keep `src/components/Attribution.tsx` aligned with attribution output.
4. Do not weaken the runtime image checks just to make a new asset render.

## Example: Black-Eyed Susan

The repo's `black-eyed-susan` record is the current model example:

- fact summary is manually paraphrased
- fact provenance is recorded
- multiple reviewed image candidates are tracked
- one preferred bundled image is used for live display
- backup candidates remain in the manifest with review notes

This is the standard to follow for future plant entries.

## What to avoid

Do not:

- copy long plant descriptions from third-party websites
- bundle images with unclear or unreviewed rights
- treat a source site's general policy as proof for every asset
- add generic `image.jpg` references without provenance
- create a second incompatible plant schema in another part of the app

## Relationship to other docs

- `IMAGE_SOURCING_POLICY.md` is the short operational image checklist.
- `LEGAL_AND_SOURCING_GUIDE.md` is the fuller repo policy.
- `backend/README.md` explains the current read-only backend scaffold.

## Future migration note

If the app later moves to SQLite or a canonical backend store, keep this policy model intact:

- plant facts stay source-tracked
- image rights stay asset-tracked
- bundled assets remain separate from raw provenance metadata
- the commercial-safe media filter remains explicit in code
