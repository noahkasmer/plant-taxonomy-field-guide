import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  AppDataStats,
  BloomMonth,
  CatalogFilterOptions,
  FactSourceName,
  FlowerColor,
  Habitat,
  ImageLicense,
  ImageSourceName,
  LicenseStatus,
  NativeStatus,
  PlantDetail,
  PlantImage,
  PlantSummary,
  PlantSynonym,
  PlantType,
} from '@/types/plant';
import { bloomMonthOrder, compareBloomMonths } from '@/utils/months';

type PlantRow = {
  id: string;
  common_name: string;
  scientific_name: string;
  family: string;
  genus: string;
  species: string;
  plant_type: PlantType;
  native_status: NativeStatus;
  leaf_arrangement: PlantDetail['leafArrangement'];
  leaf_shape: PlantDetail['leafShape'];
  leaf_margin: PlantDetail['leafMargin'];
  stem_type: PlantDetail['stemType'];
  height_min_inches: number;
  height_max_inches: number;
  identification_description: string;
  leaf_description: string;
  flower_description: string;
  habitat_description: string;
  notes: string;
  fact_source_notes: string | null;
  fact_summary_method: PlantDetail['factSummaryMethod'];
  last_verified: string | null;
};

type JoinedFactSourceRow = {
  plant_id: string;
  source_id: FactSourceName;
};

type JoinedHabitatRow = {
  plant_id: string;
  habitat_id: Habitat;
};

type BloomRow = {
  plant_id: string;
  month_label: BloomMonth;
};

type JoinedFlowerColorRow = {
  plant_id: string;
  label: FlowerColor;
};

type SynonymRow = {
  plant_id: string;
  term: string;
  kind: PlantSynonym['kind'];
};

type SimilarSpeciesRow = {
  plant_id: string;
  similar_plant_id: string;
};

type ImageRow = {
  id: string;
  plant_id: string;
  slot: PlantImage['slot'];
  local_asset_key: string | null;
  remote_url: string;
  original_url: string;
  source_id: ImageSourceName;
  license_id: ImageLicense;
  license_status: LicenseStatus;
  commercial_use_reviewed: number;
  attribution_required: number;
  caption: string | null;
  creator_name: string;
};

type ReviewedImageSourceRow = {
  plant_id: string;
  source_id: ImageSourceName;
};

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

export async function getAllPlantDetailsAsync(db: SQLiteDatabase): Promise<PlantDetail[]> {
  const [
    plantRows,
    factSourceRows,
    habitatRows,
    bloomRows,
    flowerColorRows,
    synonymRows,
    similarSpeciesRows,
    imageRows,
    reviewedImageSourceRows,
  ] = await Promise.all([
    db.getAllAsync<PlantRow>('SELECT * FROM plants ORDER BY common_name ASC'),
    db.getAllAsync<JoinedFactSourceRow>(
      'SELECT plant_id, source_id FROM plant_fact_sources ORDER BY plant_id ASC, sort_order ASC',
    ),
    db.getAllAsync<JoinedHabitatRow>(
      'SELECT plant_id, habitat_id FROM plant_habitats ORDER BY plant_id ASC, habitat_id ASC',
    ),
    db.getAllAsync<BloomRow>(
      'SELECT plant_id, month_label FROM bloom_periods ORDER BY plant_id ASC, month_number ASC',
    ),
    db.getAllAsync<JoinedFlowerColorRow>(
      `
        SELECT plant_tags.plant_id, tags.label
        FROM plant_tags
        INNER JOIN tags ON tags.id = plant_tags.tag_id
        WHERE tags.category = 'flower_color'
        ORDER BY plant_tags.plant_id ASC, tags.label ASC
      `,
    ),
    db.getAllAsync<SynonymRow>(
      'SELECT plant_id, term, kind FROM synonyms ORDER BY plant_id ASC, term ASC',
    ),
    db.getAllAsync<SimilarSpeciesRow>(
      'SELECT plant_id, similar_plant_id FROM similar_species ORDER BY plant_id ASC',
    ),
    db.getAllAsync<ImageRow>(
      `
        SELECT
          images.id,
          images.plant_id,
          images.slot,
          images.local_asset_key,
          images.remote_url,
          images.original_url,
          images.source_id,
          images.license_id,
          images.license_status,
          images.commercial_use_reviewed,
          images.attribution_required,
          images.caption,
          attributions.creator_name
        FROM images
        INNER JOIN attributions ON attributions.id = images.attribution_id
        ORDER BY images.plant_id ASC, images.slot ASC
      `,
    ),
    db.getAllAsync<ReviewedImageSourceRow>(
      'SELECT DISTINCT plant_id, source_id FROM reviewed_image_candidates ORDER BY plant_id ASC',
    ),
  ]);

  const factSourceMap = new Map<string, FactSourceName[]>();
  const habitatMap = new Map<string, Habitat[]>();
  const bloomMap = new Map<string, BloomMonth[]>();
  const flowerColorMap = new Map<string, FlowerColor[]>();
  const synonymMap = new Map<string, PlantSynonym[]>();
  const similarSpeciesMap = new Map<string, string[]>();
  const imageMap = new Map<string, PlantImage[]>();
  const imageSourceMap = new Map<string, Set<ImageSourceName>>();

  for (const row of factSourceRows) {
    const entries = factSourceMap.get(row.plant_id) ?? [];
    entries.push(row.source_id);
    factSourceMap.set(row.plant_id, entries);
  }

  for (const row of habitatRows) {
    const entries = habitatMap.get(row.plant_id) ?? [];
    entries.push(row.habitat_id);
    habitatMap.set(row.plant_id, entries);
  }

  for (const row of bloomRows) {
    const entries = bloomMap.get(row.plant_id) ?? [];
    entries.push(row.month_label);
    bloomMap.set(row.plant_id, entries);
  }

  for (const row of flowerColorRows) {
    const entries = flowerColorMap.get(row.plant_id) ?? [];
    entries.push(row.label);
    flowerColorMap.set(row.plant_id, entries);
  }

  for (const row of synonymRows) {
    const entries = synonymMap.get(row.plant_id) ?? [];
    entries.push({
      term: row.term,
      kind: row.kind,
    });
    synonymMap.set(row.plant_id, entries);
  }

  for (const row of similarSpeciesRows) {
    const entries = similarSpeciesMap.get(row.plant_id) ?? [];
    entries.push(row.similar_plant_id);
    similarSpeciesMap.set(row.plant_id, entries);
  }

  for (const row of imageRows) {
    const entries = imageMap.get(row.plant_id) ?? [];
    entries.push({
      id: row.id,
      slot: row.slot,
      assetKey: row.local_asset_key ?? undefined,
      url: row.remote_url,
      originalUrl: row.original_url,
      photographer: row.creator_name,
      source: row.source_id,
      license: row.license_id,
      licenseStatus: row.license_status,
      commercialUseReviewed: Boolean(row.commercial_use_reviewed),
      attributionRequired: Boolean(row.attribution_required),
      caption: row.caption ?? undefined,
    });
    imageMap.set(row.plant_id, entries);
  }

  for (const row of reviewedImageSourceRows) {
    const entries = imageSourceMap.get(row.plant_id) ?? new Set<ImageSourceName>();
    entries.add(row.source_id);
    imageSourceMap.set(row.plant_id, entries);
  }

  for (const row of imageRows) {
    const entries = imageSourceMap.get(row.plant_id) ?? new Set<ImageSourceName>();
    entries.add(row.source_id);
    imageSourceMap.set(row.plant_id, entries);
  }

  const details = plantRows.map<PlantDetail>((row) => ({
    id: row.id,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    family: row.family,
    genus: row.genus,
    species: row.species,
    plantType: row.plant_type,
    nativeStatus: row.native_status,
    habitats: habitatMap.get(row.id) ?? [],
    flowerColors: flowerColorMap.get(row.id) ?? [],
    bloomMonths: (bloomMap.get(row.id) ?? []).sort(compareBloomMonths),
    offlineReady: true,
    offlineImageCount: (imageMap.get(row.id) ?? []).filter((image) => Boolean(image.assetKey)).length,
    identificationDescription: row.identification_description,
    leafDescription: row.leaf_description,
    flowerDescription: row.flower_description,
    habitatDescription: row.habitat_description,
    notes: row.notes,
    leafArrangement: row.leaf_arrangement,
    leafShape: row.leaf_shape,
    leafMargin: row.leaf_margin,
    stemType: row.stem_type,
    heightRangeInches: {
      min: row.height_min_inches,
      max: row.height_max_inches,
    },
    factSources: factSourceMap.get(row.id) ?? [],
    factSourceNotes: row.fact_source_notes ?? undefined,
    factSummaryMethod: row.fact_summary_method,
    lastVerified: row.last_verified ?? undefined,
    imageSources: [...(imageSourceMap.get(row.id) ?? new Set<ImageSourceName>())],
    images: imageMap.get(row.id) ?? [],
    synonyms: synonymMap.get(row.id) ?? [],
    similarSpecies: [],
  }));

  const summariesById = new Map<string, PlantSummary>();
  for (const detail of details) {
    summariesById.set(detail.id, toPlantSummary(detail));
  }

  for (const detail of details) {
    const explicitIds = similarSpeciesMap.get(detail.id) ?? [];
    const explicit = explicitIds
      .map((id) => summariesById.get(id))
      .filter((value): value is PlantSummary => Boolean(value));

    if (explicit.length > 0) {
      detail.similarSpecies = explicit;
      continue;
    }

    detail.similarSpecies = [...summariesById.values()]
      .filter((candidate) => candidate.id !== detail.id)
      .filter(
        (candidate) =>
          candidate.family === detail.family ||
          candidate.flowerColors.some((color) => detail.flowerColors.includes(color)) ||
          candidate.habitats.some((habitat) => detail.habitats.includes(habitat)),
      )
      .slice(0, 3);
  }

  return details;
}

export function buildFilterOptions(plantSummaries: PlantSummary[]): CatalogFilterOptions {
  return {
    flowerColors: [...new Set(plantSummaries.flatMap((plant) => plant.flowerColors))].sort(),
    bloomMonths: [...new Set(plantSummaries.flatMap((plant) => plant.bloomMonths))].sort(
      compareBloomMonths,
    ),
    habitats: [...new Set(plantSummaries.flatMap((plant) => plant.habitats))].sort(),
    plantTypes: [...new Set(plantSummaries.map((plant) => plant.plantType))].sort(),
    nativeStatuses: [...new Set(plantSummaries.map((plant) => plant.nativeStatus))].sort(),
    families: [...new Set(plantSummaries.map((plant) => plant.family))].sort(),
  };
}

export async function getCatalogBootstrapAsync(db: SQLiteDatabase) {
  const details = await getAllPlantDetailsAsync(db);
  const summaries = details.map((detail) => toPlantSummary(detail));
  const filterOptions = buildFilterOptions(summaries);

  return {
    details,
    summaries,
    filterOptions,
  };
}

export async function getAppDataStatsAsync(
  db: SQLiteDatabase,
  favoriteCount: number,
  recentCount: number,
): Promise<AppDataStats> {
  const counts = await db.getFirstAsync<{
    plant_count: number;
    reviewed_image_count: number;
    bundled_image_count: number;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM plants) AS plant_count,
      (SELECT COUNT(*) FROM reviewed_image_candidates) AS reviewed_image_count,
      (SELECT COUNT(*) FROM images WHERE is_bundled = 1) AS bundled_image_count
  `);
  const meta = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM app_meta WHERE key IN (?, ?)',
    'seed_version',
    'last_seeded_at',
  );
  const metaMap = new Map(meta.map((entry) => [entry.key, entry.value]));

  return {
    plantCount: counts?.plant_count ?? 0,
    favoriteCount,
    recentCount,
    reviewedImageCount: counts?.reviewed_image_count ?? 0,
    bundledImageCount: counts?.bundled_image_count ?? 0,
    lastSeededAt: metaMap.get('last_seeded_at') ?? '',
    seedVersion: metaMap.get('seed_version') ?? '',
    databasePath: db.databasePath,
  };
}

export { bloomMonthOrder };
