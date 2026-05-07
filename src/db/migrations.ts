import type { DatabaseHandle } from '@/db/types';

type Migration = {
  version: number;
  name: string;
  sql: string;
};

function runSqlAsync(
  db: DatabaseHandle,
  source: string,
  ...params: Array<string | number | null>
) {
  return db.runAsync(source, params);
}

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'core_schema',
    sql: `
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        source_type TEXT NOT NULL,
        base_url TEXT NOT NULL,
        policy_url TEXT NOT NULL,
        usage_notes TEXT NOT NULL,
        preferred_for_commercial_app INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS licenses (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        source_url TEXT NOT NULL,
        attribution_required INTEGER NOT NULL DEFAULT 1,
        commercial_safe_default INTEGER NOT NULL DEFAULT 0,
        usage_notes TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY NOT NULL,
        common_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        family TEXT NOT NULL,
        genus TEXT NOT NULL,
        species TEXT NOT NULL,
        plant_type TEXT NOT NULL,
        native_status TEXT NOT NULL,
        leaf_arrangement TEXT NOT NULL,
        leaf_shape TEXT NOT NULL,
        leaf_margin TEXT NOT NULL,
        stem_type TEXT NOT NULL,
        height_min_inches INTEGER NOT NULL,
        height_max_inches INTEGER NOT NULL,
        identification_description TEXT NOT NULL,
        leaf_description TEXT NOT NULL,
        flower_description TEXT NOT NULL,
        habitat_description TEXT NOT NULL,
        notes TEXT NOT NULL,
        fact_source_notes TEXT,
        fact_summary_method TEXT NOT NULL,
        last_verified TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_plants_family ON plants (family);
      CREATE INDEX IF NOT EXISTS idx_plants_native_status ON plants (native_status);
      CREATE INDEX IF NOT EXISTS idx_plants_plant_type ON plants (plant_type);

      CREATE TABLE IF NOT EXISTS plant_fact_sources (
        plant_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        PRIMARY KEY (plant_id, source_id),
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS habitats (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        sort_order INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plant_habitats (
        plant_id TEXT NOT NULL,
        habitat_id TEXT NOT NULL,
        PRIMARY KEY (plant_id, habitat_id),
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (habitat_id) REFERENCES habitats(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bloom_periods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id TEXT NOT NULL,
        month_number INTEGER NOT NULL,
        month_label TEXT NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        UNIQUE (plant_id, month_number)
      );

      CREATE INDEX IF NOT EXISTS idx_bloom_periods_month_number ON bloom_periods (month_number);

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS plant_tags (
        plant_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (plant_id, tag_id),
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS attributions (
        id TEXT PRIMARY KEY NOT NULL,
        source_name TEXT NOT NULL,
        source_type TEXT NOT NULL,
        source_url TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        credit_line TEXT NOT NULL,
        license_id TEXT NOT NULL,
        notes TEXT NOT NULL,
        public_domain_basis TEXT,
        FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY NOT NULL,
        plant_id TEXT NOT NULL,
        slot TEXT NOT NULL,
        local_asset_key TEXT,
        remote_url TEXT NOT NULL,
        original_url TEXT NOT NULL,
        source_id TEXT NOT NULL,
        attribution_id TEXT NOT NULL,
        license_id TEXT NOT NULL,
        license_status TEXT NOT NULL,
        commercial_use_reviewed INTEGER NOT NULL DEFAULT 0,
        attribution_required INTEGER NOT NULL DEFAULT 1,
        is_bundled INTEGER NOT NULL DEFAULT 0,
        review_status TEXT NOT NULL,
        caption TEXT,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE,
        FOREIGN KEY (attribution_id) REFERENCES attributions(id) ON DELETE CASCADE,
        FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_images_plant_id ON images (plant_id);

      CREATE TABLE IF NOT EXISTS reviewed_image_candidates (
        id TEXT PRIMARY KEY NOT NULL,
        plant_id TEXT NOT NULL,
        asset_key TEXT,
        slot TEXT NOT NULL,
        source_id TEXT NOT NULL,
        source_page_url TEXT NOT NULL,
        photographer TEXT NOT NULL,
        credit_line TEXT NOT NULL,
        license_id TEXT NOT NULL,
        license_status TEXT NOT NULL,
        commercial_use_reviewed INTEGER NOT NULL DEFAULT 0,
        attribution_required INTEGER NOT NULL DEFAULT 1,
        caption TEXT,
        reviewed_on TEXT NOT NULL,
        reviewed_by TEXT NOT NULL,
        review_status TEXT NOT NULL,
        public_domain_basis TEXT NOT NULL,
        review_notes TEXT NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE,
        FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS synonyms (
        id TEXT PRIMARY KEY NOT NULL,
        plant_id TEXT NOT NULL,
        term TEXT NOT NULL,
        kind TEXT NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_synonyms_term ON synonyms (term);

      CREATE TABLE IF NOT EXISTS similar_species (
        plant_id TEXT NOT NULL,
        similar_plant_id TEXT NOT NULL,
        PRIMARY KEY (plant_id, similar_plant_id),
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (similar_plant_id) REFERENCES plants(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS favorites (
        plant_id TEXT PRIMARY KEY NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS recently_viewed (
        plant_id TEXT PRIMARY KEY NOT NULL,
        viewed_at TEXT NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `,
  },
];

async function ensureMigrationsTableAsync(db: DatabaseHandle) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}

export async function runMigrationsAsync(db: DatabaseHandle) {
  await ensureMigrationsTableAsync(db);
  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version ASC',
  );
  const appliedVersions = new Set(applied.map((row) => row.version));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    await db.withExclusiveTransactionAsync(async (txn: DatabaseHandle) => {
      await txn.execAsync(migration.sql);
      await runSqlAsync(
        txn,
        'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
        migration.version,
        migration.name,
        new Date().toISOString(),
      );
    });
  }
}
