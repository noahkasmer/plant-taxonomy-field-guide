# Image Sourcing Policy

This app uses a conservative image policy designed for future commercial use.

## Preferred source order

1. U.S. Fish and Wildlife Service Library public-domain media
2. National Park Service media explicitly marked public domain
3. USDA media explicitly marked public domain
4. Library of Congress public-domain collections
5. Wikimedia Commons only as a reviewed fallback

## Rules

- Do not bundle or display remote media by default.
- Do not rely on site-wide assumptions when a specific asset page gives more precise rights information.
- Only bundle images that are reviewed asset-by-asset.
- For commercial-safe display in the app, require:
  - `license = PUBLIC_DOMAIN` or `CC0`
  - `licenseStatus = verified`
  - `commercialUseReviewed = true`
- Keep `sourcePageUrl`, `creditLine`, `reviewedOn`, and `publicDomainBasis` for every approved asset.

## Current workflow

1. Find a candidate asset from an approved source family.
2. Verify the specific asset page.
3. Record the candidate in `src/data/imageManifest.ts`.
4. Download and bundle the file locally only after review is complete.
5. Add the bundled local asset to the app and keep the original source metadata for provenance.
