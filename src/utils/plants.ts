import { reviewedImageCandidates } from '@/data/imageManifest';
import { plants } from '@/data/plants';
import type {
  FactSourceName,
  FactSummaryMethod,
  HeightRangeInches,
  ReviewedImageCandidate,
  ImageSourceName,
  Plant,
} from '@/types/plant';

const factSourceLabels: Record<FactSourceName, string> = {
  USDA_PLANTS: 'USDA PLANTS',
  ILLINOIS_WILDFLOWERS: 'Illinois Wildflowers',
  INATURALIST: 'iNaturalist',
};

const imageSourceLabels: Record<ImageSourceName, string> = {
  USFWS_LIBRARY: 'U.S. Fish and Wildlife Service Library',
  NPS: 'National Park Service',
  USDA: 'U.S. Department of Agriculture',
  LIBRARY_OF_CONGRESS: 'Library of Congress',
  WIKIMEDIA_COMMONS: 'Wikimedia Commons',
};

const factSummaryLabels: Record<FactSummaryMethod, string> = {
  manual_paraphrase: 'Original manual paraphrase',
};

export function formatPlantTitle(plant: Plant) {
  return `${plant.commonName} (${plant.scientificName})`;
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

export function getReviewedImageCandidatesForPlant(plantId: string): ReviewedImageCandidate[] {
  return reviewedImageCandidates.filter((candidate) => candidate.plantId === plantId);
}

export function getPlantById(id: string) {
  return plants.find((plant) => plant.id === id);
}
