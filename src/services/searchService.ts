import type { CatalogFilters, PlantSummary } from '@/types/plant';
import { normalizeSearchText } from '@/utils/text';

function fuzzySubsequenceScore(query: string, haystack: string) {
  let queryIndex = 0;
  let score = 0;

  for (let i = 0; i < haystack.length && queryIndex < query.length; i += 1) {
    if (haystack[i] === query[queryIndex]) {
      score += 2;
      queryIndex += 1;
    } else {
      score -= 0.05;
    }
  }

  return queryIndex === query.length ? score : -Infinity;
}

function scorePlantQuery(plant: PlantSummary, normalizedQuery: string) {
  if (!normalizedQuery) {
    return 0;
  }

  const commonName = normalizeSearchText(plant.commonName);
  const scientificName = normalizeSearchText(plant.scientificName);
  const family = normalizeSearchText(plant.family);
  const description = normalizeSearchText(plant.identificationDescription);
  const synonyms = plant.synonyms.map((synonym) => normalizeSearchText(synonym.term));

  let score = -Infinity;

  if (commonName === normalizedQuery) {
    score = Math.max(score, 220);
  }
  if (scientificName === normalizedQuery) {
    score = Math.max(score, 210);
  }
  if (family === normalizedQuery) {
    score = Math.max(score, 180);
  }
  if (commonName.startsWith(normalizedQuery)) {
    score = Math.max(score, 170);
  }
  if (scientificName.startsWith(normalizedQuery)) {
    score = Math.max(score, 165);
  }
  if (family.startsWith(normalizedQuery)) {
    score = Math.max(score, 150);
  }
  if (synonyms.some((value) => value.startsWith(normalizedQuery))) {
    score = Math.max(score, 155);
  }
  if (commonName.includes(normalizedQuery)) {
    score = Math.max(score, 135);
  }
  if (scientificName.includes(normalizedQuery)) {
    score = Math.max(score, 130);
  }
  if (family.includes(normalizedQuery)) {
    score = Math.max(score, 115);
  }
  if (synonyms.some((value) => value.includes(normalizedQuery))) {
    score = Math.max(score, 120);
  }
  if (description.includes(normalizedQuery)) {
    score = Math.max(score, 90);
  }

  const fuzzyScores = [
    fuzzySubsequenceScore(normalizedQuery, commonName),
    fuzzySubsequenceScore(normalizedQuery, scientificName),
    fuzzySubsequenceScore(normalizedQuery, family),
    ...synonyms.map((value) => fuzzySubsequenceScore(normalizedQuery, value)),
  ].filter(Number.isFinite);

  if (fuzzyScores.length > 0) {
    score = Math.max(score, 60 + Math.max(...fuzzyScores));
  }

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const tokenHaystack = `${commonName} ${scientificName} ${family} ${synonyms.join(' ')} ${description}`;
  const matchedTokenCount = tokens.filter((token) => tokenHaystack.includes(token)).length;
  if (matchedTokenCount > 0) {
    score = Math.max(score, 70 + matchedTokenCount * 8);
  }

  return score;
}

export function matchesCatalogFilters(plant: PlantSummary, filters: CatalogFilters) {
  if (
    filters.flowerColors.length > 0 &&
    !filters.flowerColors.some((color) => plant.flowerColors.includes(color))
  ) {
    return false;
  }

  if (
    filters.bloomMonths.length > 0 &&
    !filters.bloomMonths.some((month) => plant.bloomMonths.includes(month))
  ) {
    return false;
  }

  if (
    filters.habitats.length > 0 &&
    !filters.habitats.some((habitat) => plant.habitats.includes(habitat))
  ) {
    return false;
  }

  if (filters.plantTypes.length > 0 && !filters.plantTypes.includes(plant.plantType)) {
    return false;
  }

  if (
    filters.nativeStatuses.length > 0 &&
    !filters.nativeStatuses.includes(plant.nativeStatus)
  ) {
    return false;
  }

  if (filters.families.length > 0 && !filters.families.includes(plant.family)) {
    return false;
  }

  return true;
}

export function searchPlants(plantSummaries: PlantSummary[], filters: CatalogFilters) {
  const normalizedQuery = normalizeSearchText(filters.query);

  return plantSummaries
    .filter((plant) => matchesCatalogFilters(plant, filters))
    .map((plant) => ({
      plant,
      score: scorePlantQuery(plant, normalizedQuery),
    }))
    .filter((entry) => normalizedQuery.length === 0 || Number.isFinite(entry.score))
    .sort((left, right) => {
      if (normalizedQuery.length === 0) {
        return left.plant.commonName.localeCompare(right.plant.commonName);
      }

      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.plant.commonName.localeCompare(right.plant.commonName);
    })
    .map((entry) => entry.plant);
}

export function getActiveFilterCount(filters: CatalogFilters) {
  return (
    filters.flowerColors.length +
    filters.bloomMonths.length +
    filters.habitats.length +
    filters.plantTypes.length +
    filters.nativeStatuses.length +
    filters.families.length
  );
}
