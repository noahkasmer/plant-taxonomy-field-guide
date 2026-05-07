import { reviewedImageCandidates } from '@/data/imageManifest';
import { plants } from '@/data/plants';
import type {
  FactSourceName,
  FactSummaryMethod,
  HeightRangeInches,
  ImageSourceName,
  Plant,
  PlantType,
  ReviewedImageCandidate,
} from '@/types/plant';
import { formatBloomWindow as formatBloomWindowFromMonths } from '@/utils/months';

const factSourceLabels: Record<FactSourceName, string> = {
  USDA_PLANTS: 'USDA PLANTS Database',
  ILLINOIS_WILDFLOWERS: 'Illinois Wildflowers',
  US_FOREST_SERVICE: 'U.S. Forest Service',
  ILLINOIS_EXTENSION: 'Illinois Extension',
  INATURALIST_METADATA: 'iNaturalist metadata',
};

const imageSourceLabels: Record<ImageSourceName, string> = {
  USFWS_LIBRARY: 'U.S. Fish and Wildlife Service Library',
  NPS: 'National Park Service',
  USDA: 'U.S. Department of Agriculture',
  LIBRARY_OF_CONGRESS: 'Library of Congress',
  WIKIMEDIA_COMMONS: 'Wikimedia Commons',
  INATURALIST: 'iNaturalist',
};

const factSummaryLabels: Record<FactSummaryMethod, string> = {
  manual_paraphrase: 'Original manual paraphrase',
};

const plantTypeLabels: Record<PlantType, string> = {
  wildflower: 'Wildflower',
  shrub: 'Shrub',
  vine: 'Vine',
  fern: 'Fern',
  tree: 'Tree',
};

export function formatPlantTitle(plant: Pick<Plant, 'commonName' | 'scientificName'>) {
  return `${plant.commonName} (${plant.scientificName})`;
}

export function formatPlantType(plantType: PlantType) {
  return plantTypeLabels[plantType];
}

export function formatTraitList(values: string[]) {
  return values.join(', ');
}

export function formatHeightRange(range: HeightRangeInches) {
  return `${range.min}-${range.max} in.`;
}

export function formatFactSourceName(source: FactSourceName) {
  return factSourceLabels[source];
}

export function formatFactSourceList(values: FactSourceName[]) {
  return values.map((value) => formatFactSourceName(value)).join(', ');
}

export function formatImageSourceName(source: ImageSourceName) {
  return imageSourceLabels[source];
}

export function formatImageSourceList(values: ImageSourceName[]) {
  return values.map((value) => formatImageSourceName(value)).join(', ');
}

export function formatFactSummaryMethod(method: FactSummaryMethod) {
  return factSummaryLabels[method];
}

export function formatBloomWindow(values: Plant['bloomMonths']) {
  return formatBloomWindowFromMonths(values);
}

export function getReviewedImageCandidatesForPlant(plantId: string): ReviewedImageCandidate[] {
  return reviewedImageCandidates.filter((candidate) => candidate.plantId === plantId);
}

export function getPlantById(id: string) {
  return plants.find((plant) => plant.id === id);
}
