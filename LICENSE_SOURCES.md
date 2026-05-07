# License and Source Policy

This repository uses a conservative import policy for both factual plant data and images.

## Principles

1. Facts may be learned from references, but written summaries in the app must remain original paraphrases.
2. Images must not enter the live app without explicit attribution and license metadata.
3. Commercial safety is stricter than schema validity. An image can be technically modeled in the data layer and still be blocked from live display.
4. The canonical import source is `src/data/`. The backend mirror is downstream and must not become a second source of truth.

## Allowed factual source classes

These sources are acceptable as factual references when the app stores original summaries rather than copied prose:

- `USDA_PLANTS`
- `US_FOREST_SERVICE`
- `ILLINOIS_WILDFLOWERS`
- `ILLINOIS_EXTENSION`
- `INATURALIST_METADATA`

### Factual source rules

- Use them to verify names, habitats, morphology, bloom windows, and distribution context.
- Do not copy long descriptions verbatim.
- Keep `factSources`, `factSourceNotes`, and `factSummaryMethod` populated.
- Prefer multiple references for plants with ambiguous field traits.

## Allowed image source classes

These sources may be used only when the specific asset page is reviewed and attribution metadata is complete:

- `USFWS_LIBRARY`
- `NPS`
- `USDA`
- `LIBRARY_OF_CONGRESS`
- `WIKIMEDIA_COMMONS`

### Preferred order for commercial-safe live assets

1. U.S. Fish and Wildlife Service media explicitly marked public domain
2. USDA media explicitly public domain or otherwise clearly reusable
3. National Park Service media only when the specific asset page clearly allows reuse
4. Library of Congress public-domain holdings
5. Wikimedia Commons public-domain or CC0 reviewed fallback assets

## Allowed license classes

### Default live-app safe

- `PUBLIC_DOMAIN`
- `CC0`

### Modeled but not default commercial-safe live display

- `CC_BY`
- `CC_BY_SA`

These licenses require complete attribution metadata and are allowed in the model only because they may be useful for future non-default flows or editorial review. The current live app does not treat them as commercial-safe defaults.

### Blocked

- `UNKNOWN`
- Missing license metadata
- Assets without a verifiable source page

## Required image metadata

Every imported image or reviewed image candidate must include:

- source id
- source/original URL
- photographer or creator
- license id
- license review status
- attribution required flag
- commercial use review flag
- reviewer
- review date
- public-domain basis or usage rationale

Validation should fail if these fields are missing for imported media metadata.

## Disallowed practices

- Scraping copyrighted commercial plant books
- Importing images without asset-level license review
- Treating “government website” as enough without checking the asset page or agency policy
- Copying copyrighted descriptive prose into seed data
- Bundling logos or restricted insignia for display as plant media

## Related files

- [IMAGE_SOURCING_POLICY.md](./IMAGE_SOURCING_POLICY.md)
- [LEGAL_AND_SOURCING_GUIDE.md](./LEGAL_AND_SOURCING_GUIDE.md)
- [src/data/sources.ts](./src/data/sources.ts)
- [src/data/licenses.ts](./src/data/licenses.ts)
