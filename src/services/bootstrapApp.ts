import { Platform } from 'react-native';

import { reviewedImageCandidates } from '@/data/imageManifest';
import { plants } from '@/data/plants';
import { getDatabaseAsync } from '@/db/client';
import { SEED_VERSION } from '@/db/constants';
import {
  buildFilterOptions,
  getAppDataStatsAsync,
  getCatalogBootstrapAsync,
} from '@/db/repositories/catalogRepository';
import { getThemePreferenceAsync } from '@/db/repositories/settingsRepository';
import {
  getFavoritePlantIdsAsync,
  getRecentlyViewedPlantIdsAsync,
} from '@/db/repositories/userDataRepository';
import { getSeedVersionAsync, seedDatabaseAsync } from '@/db/seed';
import { runMigrationsAsync } from '@/db/migrations';
import { useAppStore, type BootstrapSnapshot } from '@/store/appStore';
import type { PlantDetail, PlantSummary } from '@/types/plant';

function toPlantSummary(detail: PlantDetail): PlantSummary {
  const heroImage =
    detail.images.find((image) => image.slot === 'hero') ??
    detail.images[0];

  return {
    id: detail.id,
    commonName: detail.commonName,
    scientificName: detail.scientificName,
    family: detail.family,
    plantType: detail.plantType,
    nativeStatus: detail.nativeStatus,
    habitats: detail.habitats,
    flowerColors: detail.flowerColors,
    bloomMonths: detail.bloomMonths,
    offlineReady: true,
    offlineImageCount: detail.images.filter((image) => Boolean(image.assetKey)).length,
    identificationDescription: detail.identificationDescription,
    synonyms: detail.synonyms,
    heroImage,
  };
}

function createBundledBootstrapSnapshot(): BootstrapSnapshot {
  const details = plants.map<PlantDetail>((plant) => ({
    ...plant,
    offlineReady: true,
    offlineImageCount: plant.images.filter((image) => Boolean(image.assetKey)).length,
    similarSpecies: [],
  }));

  const summaries = details.map((detail) => toPlantSummary(detail));
  const summaryById = new Map(summaries.map((summary) => [summary.id, summary]));
  const similarSpeciesIdsByPlantId = new Map(plants.map((plant) => [plant.id, plant.similarSpeciesIds]));

  for (const detail of details) {
    detail.similarSpecies = (similarSpeciesIdsByPlantId.get(detail.id) ?? [])
      .map((id) => summaryById.get(id))
      .filter((value): value is PlantSummary => Boolean(value));
  }

  const bundledImageCount = details.reduce(
    (total, detail) => total + detail.images.filter((image) => Boolean(image.assetKey)).length,
    0,
  );

  return {
    plantSummaries: summaries,
    plantDetails: details,
    filterOptions: buildFilterOptions(summaries),
    favoriteIds: [],
    recentPlantIds: [],
    themePreference: 'system',
    stats: {
      plantCount: details.length,
      favoriteCount: 0,
      recentCount: 0,
      reviewedImageCount: reviewedImageCandidates.length,
      bundledImageCount,
      lastSeededAt: new Date().toISOString(),
      seedVersion: SEED_VERSION,
      databasePath: 'bundled-web-fallback',
    },
  };
}

export async function loadBootstrapSnapshotAsync(): Promise<BootstrapSnapshot> {
  if (Platform.OS === 'web') {
    // Web preview uses the canonical bundled catalog directly so Expo web can
    // render reliably even when expo-sqlite is unavailable or unstable there.
    return createBundledBootstrapSnapshot();
  }

  const db = await getDatabaseAsync();
  await runMigrationsAsync(db);

  const currentSeedVersion = await getSeedVersionAsync(db);
  if (currentSeedVersion !== SEED_VERSION) {
    await seedDatabaseAsync(db);
  }

  const [{ details, summaries, filterOptions }, favoriteIds, recentPlantIds, themePreference] =
    await Promise.all([
      getCatalogBootstrapAsync(db),
      getFavoritePlantIdsAsync(db),
      getRecentlyViewedPlantIdsAsync(db),
      getThemePreferenceAsync(db),
    ]);

  const stats = await getAppDataStatsAsync(
    db,
    favoriteIds.length,
    recentPlantIds.length,
  );

  return {
    plantSummaries: summaries,
    plantDetails: details,
    filterOptions,
    favoriteIds,
    recentPlantIds,
    themePreference,
    stats,
  };
}

export async function initializeAppAsync() {
  const store = useAppStore.getState();
  store.setStatus('loading');
  store.setErrorMessage(null);

  try {
    const snapshot = await loadBootstrapSnapshotAsync();
    useAppStore.getState().hydrate(snapshot);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to initialize local plant data.';
    useAppStore.getState().setStatus('error');
    useAppStore.getState().setErrorMessage(message);
    throw error;
  }
}
