import * as SQLite from 'expo-sqlite';

import { plants as starterPlants } from '@/data/plants';
import type { HeightRangeInches, Plant } from '@/types/plant';

const DATABASE_NAME = 'illinois-plant-field-guide.db';
const SCHEMA_VERSION = 1;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

// TODO(image-licensing): add a media_imports table after the licensing review workflow is finalized.
type PlantRow = {
  id: string;
  common_name: string;
  scientific_name: string;
  family: string;
  genus: string;
  species: string;
  native_status: Plant['nativeStatus'];
  fact_sources_json: string;
  fact_source_notes: string | null;
  fact_summary_method: Plant['factSummaryMethod'];
  last_verified: string | null;
  image_sources_json: string;
  habitats_json: string;
  bloom_season: string;
  flower_colors_json: string;
  bloom_months_json: string;
  leaf_arrangement: Plant['leafArrangement'];
  leaf_shape: Plant['leafShape'];
  leaf_margin: Plant['leafMargin'];
  stem_type: Plant['stemType'];
  height_min_inches: number;
  height_max_inches: number;
  identifying_features_json: string;
  notes: string;
  images_json: string;
  search_text: string;
};

function toJson(value: unknown) {
  return JSON.stringify(value);
}

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}

function buildSearchText(plant: Plant) {
  return [
    plant.commonName,
    plant.scientificName,
    plant.family,
    plant.genus,
    plant.bloomSeason,
    plant.habitats.join(' '),
    plant.identifyingFeatures.join(' '),
    plant.notes,
  ]
    .join(' ')
    .toLowerCase();
}

function plantToParams(plant: Plant) {
  return {
    $id: plant.id,
    $commonName: plant.commonName,
    $scientificName: plant.scientificName,
    $family: plant.family,
    $genus: plant.genus,
    $species: plant.species,
    $nativeStatus: plant.nativeStatus,
    $factSourcesJson: toJson(plant.factSources),
    $factSourceNotes: plant.factSourceNotes ?? null,
    $factSummaryMethod: plant.factSummaryMethod,
    $lastVerified: plant.lastVerified ?? null,
    $imageSourcesJson: toJson(plant.imageSources),
    $habitatsJson: toJson(plant.habitats),
    $bloomSeason: plant.bloomSeason,
    $flowerColorsJson: toJson(plant.flowerColors),
    $bloomMonthsJson: toJson(plant.bloomMonths),
    $leafArrangement: plant.leafArrangement,
    $leafShape: plant.leafShape,
    $leafMargin: plant.leafMargin,
    $stemType: plant.stemType,
    $heightMinInches: plant.heightRangeInches.min,
    $heightMaxInches: plant.heightRangeInches.max,
    $identifyingFeaturesJson: toJson(plant.identifyingFeatures),
    $notes: plant.notes,
    $imagesJson: toJson(plant.images),
    $searchText: buildSearchText(plant),
  };
}

function rowToPlant(row: PlantRow): Plant {
  const heightRangeInches: HeightRangeInches = {
    min: row.height_min_inches,
    max: row.height_max_inches,
  };

  return {
    id: row.id,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    family: row.family,
    genus: row.genus,
    species: row.species,
    nativeStatus: row.native_status,
    factSources: parseJson<Plant['factSources']>(row.fact_sources_json),
    factSourceNotes: row.fact_source_notes ?? undefined,
    factSummaryMethod: row.fact_summary_method,
    lastVerified: row.last_verified ?? undefined,
    imageSources: parseJson<Plant['imageSources']>(row.image_sources_json),
    habitats: parseJson<Plant['habitats']>(row.habitats_json),
    bloomSeason: row.bloom_season,
    flowerColors: parseJson<Plant['flowerColors']>(row.flower_colors_json),
    bloomMonths: parseJson<Plant['bloomMonths']>(row.bloom_months_json),
    leafArrangement: row.leaf_arrangement,
    leafShape: row.leaf_shape,
    leafMargin: row.leaf_margin,
    stemType: row.stem_type,
    heightRangeInches,
    identifyingFeatures: parseJson<Plant['identifyingFeatures']>(row.identifying_features_json),
    notes: row.notes,
    images: parseJson<Plant['images']>(row.images_json),
  };
}

async function getDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME);
  return databasePromise;
}

async function createSchema(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY NOT NULL,
      common_name TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      family TEXT NOT NULL,
      genus TEXT NOT NULL,
      species TEXT NOT NULL,
      native_status TEXT NOT NULL,
      fact_sources_json TEXT NOT NULL,
      fact_source_notes TEXT,
      fact_summary_method TEXT NOT NULL,
      last_verified TEXT,
      image_sources_json TEXT NOT NULL,
      habitats_json TEXT NOT NULL,
      bloom_season TEXT NOT NULL,
      flower_colors_json TEXT NOT NULL,
      bloom_months_json TEXT NOT NULL,
      leaf_arrangement TEXT NOT NULL,
      leaf_shape TEXT NOT NULL,
      leaf_margin TEXT NOT NULL,
      stem_type TEXT NOT NULL,
      height_min_inches INTEGER NOT NULL,
      height_max_inches INTEGER NOT NULL,
      identifying_features_json TEXT NOT NULL,
      notes TEXT NOT NULL,
      images_json TEXT NOT NULL,
      search_text TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_plants_common_name ON plants(common_name);
    CREATE INDEX IF NOT EXISTS idx_plants_family ON plants(family);
    CREATE INDEX IF NOT EXISTS idx_plants_search_text ON plants(search_text);
  `);
}

async function seedStarterPlants(db: SQLite.SQLiteDatabase) {
  await db.runAsync('DELETE FROM plants');

  await Promise.all(
    starterPlants.map((plant) =>
      db.runAsync(
        `INSERT INTO plants (
          id,
          common_name,
          scientific_name,
          family,
          genus,
          species,
          native_status,
          fact_sources_json,
          fact_source_notes,
          fact_summary_method,
          last_verified,
          image_sources_json,
          habitats_json,
          bloom_season,
          flower_colors_json,
          bloom_months_json,
          leaf_arrangement,
          leaf_shape,
          leaf_margin,
          stem_type,
          height_min_inches,
          height_max_inches,
          identifying_features_json,
          notes,
          images_json,
          search_text
        ) VALUES (
          $id,
          $commonName,
          $scientificName,
          $family,
          $genus,
          $species,
          $nativeStatus,
          $factSourcesJson,
          $factSourceNotes,
          $factSummaryMethod,
          $lastVerified,
          $imageSourcesJson,
          $habitatsJson,
          $bloomSeason,
          $flowerColorsJson,
          $bloomMonthsJson,
          $leafArrangement,
          $leafShape,
          $leafMargin,
          $stemType,
          $heightMinInches,
          $heightMaxInches,
          $identifyingFeaturesJson,
          $notes,
          $imagesJson,
          $searchText
        )`,
        plantToParams(plant),
      ),
    ),
  );

  await db.runAsync(
    `INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('schema_version', $schemaVersion)`,
    { $schemaVersion: String(SCHEMA_VERSION) },
  );
}

export async function initializePlantDatabase() {
  const db = await getDatabase();
  await createSchema(db);

  const metadata = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_metadata WHERE key = 'schema_version'`,
  );

  if (metadata?.value !== String(SCHEMA_VERSION)) {
    await seedStarterPlants(db);
  }

  return db;
}

export async function getPlantsFromDatabase(searchQuery = ''): Promise<Plant[]> {
  const db = await initializePlantDatabase();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const rows = normalizedQuery
    ? await db.getAllAsync<PlantRow>(
        `SELECT * FROM plants
         WHERE search_text LIKE $searchQuery
         ORDER BY common_name COLLATE NOCASE ASC`,
        { $searchQuery: `%${normalizedQuery}%` },
      )
    : await db.getAllAsync<PlantRow>(
        `SELECT * FROM plants ORDER BY common_name COLLATE NOCASE ASC`,
      );

  return rows.map(rowToPlant);
}

export async function getPlantFromDatabaseById(id: string): Promise<Plant | undefined> {
  const db = await initializePlantDatabase();
  const row = await db.getFirstAsync<PlantRow>(
    `SELECT * FROM plants WHERE id = $id LIMIT 1`,
    { $id: id },
  );

  return row ? rowToPlant(row) : undefined;
}
