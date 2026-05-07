import { bundledPlantImageAssetKeys } from '@/data/imageAssetKeys';
import { reviewedImageCandidates } from '@/data/imageManifest';
import { licenseCatalog } from '@/data/licenses';
import { plants } from '@/data/plants';
import { sourceCatalog } from '@/data/sources';
import type { Plant, ReviewedImageCandidate, SourceCatalogEntry } from '@/types/plant';

class CatalogValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogValidationError';
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new CatalogValidationError(message);
  }
}

function hasValue(value: string | undefined | null) {
  return Boolean(value?.trim());
}

function validatePlantImage(plant: Plant, image: Plant['images'][number], imageSources: Set<string>) {
  assert(hasValue(image.id), `${plant.id}: image id is required.`);
  assert(hasValue(image.url), `${plant.id}: image url is required.`);
  assert(hasValue(image.originalUrl), `${plant.id}: image originalUrl is required.`);
  assert(hasValue(image.photographer), `${plant.id}: image photographer is required.`);
  assert(imageSources.has(image.source), `${plant.id}: image source ${image.source} is not in the source catalog.`);

  if (image.licenseStatus === 'verified') {
    assert(
      image.license !== 'UNKNOWN',
      `${plant.id}: verified images cannot use UNKNOWN license.`,
    );
  }

  if (image.assetKey) {
    assert(
      bundledPlantImageAssetKeys.includes(image.assetKey as (typeof bundledPlantImageAssetKeys)[number]),
      `${plant.id}: missing bundled asset for image assetKey ${image.assetKey}.`,
    );
  }
}

function validateImageCandidate(
  plantIds: Set<string>,
  imageSources: Set<string>,
  candidate: ReviewedImageCandidate,
) {
  assert(
    plantIds.has(candidate.plantId),
    `${candidate.id}: reviewed image candidate references missing plant ${candidate.plantId}.`,
  );
  assert(
    imageSources.has(candidate.source),
    `${candidate.id}: reviewed image candidate source ${candidate.source} is not in the source catalog.`,
  );
  assert(hasValue(candidate.sourcePageUrl), `${candidate.id}: sourcePageUrl is required.`);
  assert(hasValue(candidate.photographer), `${candidate.id}: photographer is required.`);
  assert(hasValue(candidate.creditLine), `${candidate.id}: creditLine is required.`);
  assert(hasValue(candidate.reviewedOn), `${candidate.id}: reviewedOn is required.`);
  assert(hasValue(candidate.reviewedBy), `${candidate.id}: reviewedBy is required.`);
  assert(hasValue(candidate.publicDomainBasis), `${candidate.id}: publicDomainBasis is required.`);
  assert(hasValue(candidate.reviewNotes), `${candidate.id}: reviewNotes is required.`);

  if (candidate.reviewStatus === 'bundled') {
    assert(
      candidate.assetKey &&
        bundledPlantImageAssetKeys.includes(
          candidate.assetKey as (typeof bundledPlantImageAssetKeys)[number],
        ),
      `${candidate.id}: bundled reviewed image candidate must reference a local bundled asset.`,
    );
  }
}

export type CatalogValidationSummary = {
  plantCount: number;
  bundledImageCount: number;
  reviewedImageCandidateCount: number;
  sourceCount: number;
  licenseCount: number;
};

export function validateCatalogData(): CatalogValidationSummary {
  const plantIds = new Set<string>();
  const imageIds = new Set<string>();
  const licenseIds = new Set(licenseCatalog.map((entry) => entry.id));
  const sources = new Map<string, SourceCatalogEntry>(
    sourceCatalog.map((entry) => [entry.id, entry]),
  );
  const imageSources = new Set(
    sourceCatalog.filter((entry) => entry.sourceType === 'image').map((entry) => entry.id),
  );
  const factSources = new Set(
    sourceCatalog.filter((entry) => entry.sourceType === 'fact').map((entry) => entry.id),
  );

  assert(plants.length >= 25, 'Catalog must contain at least 25 plants for the MVP.');

  for (const license of licenseCatalog) {
    assert(hasValue(license.label), `License ${license.id} is missing a label.`);
    assert(hasValue(license.sourceUrl), `License ${license.id} is missing a source URL.`);
    assert(hasValue(license.usageNotes), `License ${license.id} is missing usage notes.`);
  }

  for (const source of sourceCatalog) {
    assert(hasValue(source.label), `Source ${source.id} is missing a label.`);
    assert(hasValue(source.baseUrl), `Source ${source.id} is missing a base URL.`);
    assert(hasValue(source.policyUrl), `Source ${source.id} is missing a policy URL.`);
    assert(hasValue(source.usageNotes), `Source ${source.id} is missing usage notes.`);
  }

  for (const plant of plants) {
    assert(!plantIds.has(plant.id), `Duplicate plant id ${plant.id}.`);
    plantIds.add(plant.id);

    assert(hasValue(plant.commonName), `${plant.id}: commonName is required.`);
    assert(hasValue(plant.scientificName), `${plant.id}: scientificName is required.`);
    assert(hasValue(plant.family), `${plant.id}: family is required.`);
    assert(plant.habitats.length > 0, `${plant.id}: at least one habitat is required.`);
    assert(plant.flowerColors.length > 0, `${plant.id}: at least one flower color is required.`);
    assert(plant.bloomMonths.length > 0, `${plant.id}: at least one bloom month is required.`);
    assert(
      hasValue(plant.identificationDescription),
      `${plant.id}: identificationDescription is required.`,
    );
    assert(hasValue(plant.leafDescription), `${plant.id}: leafDescription is required.`);
    assert(hasValue(plant.flowerDescription), `${plant.id}: flowerDescription is required.`);
    assert(hasValue(plant.habitatDescription), `${plant.id}: habitatDescription is required.`);
    assert(hasValue(plant.notes), `${plant.id}: notes are required.`);
    assert(plant.factSources.length > 0, `${plant.id}: at least one fact source is required.`);

    for (const factSourceId of plant.factSources) {
      assert(
        factSources.has(factSourceId),
        `${plant.id}: fact source ${factSourceId} is not present in the fact source catalog.`,
      );
    }

    for (const imageSourceId of plant.imageSources) {
      assert(
        imageSources.has(imageSourceId),
        `${plant.id}: image source ${imageSourceId} is not present in the image source catalog.`,
      );
    }

    for (const synonym of plant.synonyms) {
      assert(hasValue(synonym.term), `${plant.id}: synonym term is required.`);
    }

    for (const image of plant.images) {
      assert(!imageIds.has(image.id), `Duplicate image id ${image.id}.`);
      imageIds.add(image.id);
      assert(
        licenseIds.has(image.license),
        `${plant.id}: image ${image.id} references unknown license ${image.license}.`,
      );
      validatePlantImage(plant, image, imageSources);
    }
  }

  for (const plant of plants) {
    for (const similarSpeciesId of plant.similarSpeciesIds) {
      assert(
        plantIds.has(similarSpeciesId),
        `${plant.id}: similar species ${similarSpeciesId} does not exist in the catalog.`,
      );
    }
  }

  for (const candidate of reviewedImageCandidates) {
    assert(
      licenseIds.has(candidate.license),
      `${candidate.id}: reviewed image candidate references unknown license ${candidate.license}.`,
    );
    validateImageCandidate(plantIds, imageSources, candidate);
  }

  return {
    plantCount: plants.length,
    bundledImageCount: bundledPlantImageAssetKeys.length,
    reviewedImageCandidateCount: reviewedImageCandidates.length,
    sourceCount: sources.size,
    licenseCount: licenseCatalog.length,
  };
}
