import type { SQLiteDatabase } from 'expo-sqlite';

import { reviewedImageCandidates } from '@/data/imageManifest';
import { licenseCatalog } from '@/data/licenses';
import { plants } from '@/data/plants';
import { sourceCatalog } from '@/data/sources';
import { validateCatalogData } from '@/data/validateCatalog';
import { SEED_VERSION } from '@/db/constants';
import { getBloomMonthNumber } from '@/utils/months';
import { slugify } from '@/utils/text';

function sourceCatalogSortValue(sourceType: 'fact' | 'image') {
  return sourceType === 'fact' ? 0 : 1;
}

export async function getSeedVersionAsync(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    'seed_version',
  );

  return row?.value ?? null;
}

async function clearSeedTablesAsync(db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM reviewed_image_candidates;
    DELETE FROM images;
    DELETE FROM attributions;
    DELETE FROM plant_tags;
    DELETE FROM tags;
    DELETE FROM bloom_periods;
    DELETE FROM plant_habitats;
    DELETE FROM habitats;
    DELETE FROM plant_fact_sources;
    DELETE FROM synonyms;
    DELETE FROM similar_species;
    DELETE FROM plants;
    DELETE FROM sources;
    DELETE FROM licenses;
  `);
}

export async function seedDatabaseAsync(db: SQLiteDatabase) {
  validateCatalogData();

  await db.withExclusiveTransactionAsync(async (txn) => {
    await clearSeedTablesAsync(txn);

    const orderedHabitats = [...new Set(plants.flatMap((plant) => plant.habitats))].sort();
    const flowerColorTags = [...new Set(plants.flatMap((plant) => plant.flowerColors))].sort();

    for (const source of sourceCatalog) {
      await txn.runAsync(
        `
          INSERT INTO sources (
            id,
            label,
            source_type,
            base_url,
            policy_url,
            usage_notes,
            preferred_for_commercial_app
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        source.id,
        source.label,
        source.sourceType,
        source.baseUrl,
        source.policyUrl,
        source.usageNotes,
        source.preferredForCommercialApp ? 1 : 0,
      );
    }

    for (const license of licenseCatalog) {
      await txn.runAsync(
        `
          INSERT INTO licenses (
            id,
            label,
            source_url,
            attribution_required,
            commercial_safe_default,
            usage_notes
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        license.id,
        license.label,
        license.sourceUrl,
        license.attributionRequired ? 1 : 0,
        license.commercialSafeDefault ? 1 : 0,
        license.usageNotes,
      );
    }

    for (const [index, habitat] of orderedHabitats.entries()) {
      await txn.runAsync(
        'INSERT INTO habitats (id, label, sort_order) VALUES (?, ?, ?)',
        habitat,
        habitat,
        index,
      );
    }

    for (const flowerColor of flowerColorTags) {
      const tagId = `flower-color:${flowerColor}`;
      await txn.runAsync(
        'INSERT INTO tags (id, category, label, slug) VALUES (?, ?, ?, ?)',
        tagId,
        'flower_color',
        flowerColor,
        slugify(flowerColor),
      );
    }

    for (const plant of plants) {
      await txn.runAsync(
        `
          INSERT INTO plants (
            id,
            common_name,
            scientific_name,
            family,
            genus,
            species,
            plant_type,
            native_status,
            leaf_arrangement,
            leaf_shape,
            leaf_margin,
            stem_type,
            height_min_inches,
            height_max_inches,
            identification_description,
            leaf_description,
            flower_description,
            habitat_description,
            notes,
            fact_source_notes,
            fact_summary_method,
            last_verified
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        plant.id,
        plant.commonName,
        plant.scientificName,
        plant.family,
        plant.genus,
        plant.species,
        plant.plantType,
        plant.nativeStatus,
        plant.leafArrangement,
        plant.leafShape,
        plant.leafMargin,
        plant.stemType,
        plant.heightRangeInches.min,
        plant.heightRangeInches.max,
        plant.identificationDescription,
        plant.leafDescription,
        plant.flowerDescription,
        plant.habitatDescription,
        plant.notes,
        plant.factSourceNotes ?? null,
        plant.factSummaryMethod,
        plant.lastVerified ?? null,
      );
    }

    for (const plant of plants) {
      for (const [index, factSource] of plant.factSources.entries()) {
        await txn.runAsync(
          'INSERT INTO plant_fact_sources (plant_id, source_id, sort_order) VALUES (?, ?, ?)',
          plant.id,
          factSource,
          index,
        );
      }

      for (const habitat of plant.habitats) {
        await txn.runAsync(
          'INSERT INTO plant_habitats (plant_id, habitat_id) VALUES (?, ?)',
          plant.id,
          habitat,
        );
      }

      for (const bloomMonth of plant.bloomMonths) {
        await txn.runAsync(
          'INSERT INTO bloom_periods (plant_id, month_number, month_label) VALUES (?, ?, ?)',
          plant.id,
          getBloomMonthNumber(bloomMonth),
          bloomMonth,
        );
      }

      for (const flowerColor of plant.flowerColors) {
        const tagId = `flower-color:${flowerColor}`;
        await txn.runAsync(
          'INSERT INTO plant_tags (plant_id, tag_id) VALUES (?, ?)',
          plant.id,
          tagId,
        );
      }

      for (const synonym of plant.synonyms) {
        await txn.runAsync(
          'INSERT INTO synonyms (id, plant_id, term, kind) VALUES (?, ?, ?, ?)',
          `${plant.id}:${synonym.kind}:${slugify(synonym.term)}`,
          plant.id,
          synonym.term,
          synonym.kind,
        );
      }

      for (const image of plant.images) {
        const attributionId = `attribution:${image.id}`;
        await txn.runAsync(
          `
            INSERT INTO attributions (
              id,
              source_name,
              source_type,
              source_url,
              creator_name,
              credit_line,
              license_id,
              notes,
              public_domain_basis
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          attributionId,
          image.source,
          'image',
          image.originalUrl,
          image.photographer,
          image.photographer,
          image.license,
          image.caption ?? 'Bundled plant image',
          image.license === 'PUBLIC_DOMAIN' || image.license === 'CC0'
            ? 'Bundled live asset reviewed for conservative offline use.'
            : null,
        );

        await txn.runAsync(
          `
            INSERT INTO images (
              id,
              plant_id,
              slot,
              local_asset_key,
              remote_url,
              original_url,
              source_id,
              attribution_id,
              license_id,
              license_status,
              commercial_use_reviewed,
              attribution_required,
              is_bundled,
              review_status,
              caption
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          image.id,
          plant.id,
          image.slot,
          image.assetKey ?? null,
          image.url,
          image.originalUrl,
          image.source,
          attributionId,
          image.license,
          image.licenseStatus,
          image.commercialUseReviewed ? 1 : 0,
          image.attributionRequired ? 1 : 0,
          image.assetKey ? 1 : 0,
          image.assetKey ? 'bundled' : 'approved_for_bundle',
          image.caption ?? null,
        );
      }
    }

    for (const plant of plants) {
      for (const similarSpeciesId of plant.similarSpeciesIds) {
        await txn.runAsync(
          'INSERT INTO similar_species (plant_id, similar_plant_id) VALUES (?, ?)',
          plant.id,
          similarSpeciesId,
        );
      }
    }

    for (const candidate of reviewedImageCandidates) {
      await txn.runAsync(
        `
          INSERT INTO reviewed_image_candidates (
            id,
            plant_id,
            asset_key,
            slot,
            source_id,
            source_page_url,
            photographer,
            credit_line,
            license_id,
            license_status,
            commercial_use_reviewed,
            attribution_required,
            caption,
            reviewed_on,
            reviewed_by,
            review_status,
            public_domain_basis,
            review_notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        candidate.id,
        candidate.plantId,
        candidate.assetKey ?? null,
        candidate.slot,
        candidate.source,
        candidate.sourcePageUrl,
        candidate.photographer,
        candidate.creditLine,
        candidate.license,
        candidate.licenseStatus,
        candidate.commercialUseReviewed ? 1 : 0,
        candidate.attributionRequired ? 1 : 0,
        candidate.caption ?? null,
        candidate.reviewedOn,
        candidate.reviewedBy,
        candidate.reviewStatus,
        candidate.publicDomainBasis,
        candidate.reviewNotes,
      );
    }

    const now = new Date().toISOString();
    await txn.runAsync(
      'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
      'seed_version',
      SEED_VERSION,
    );
    await txn.runAsync(
      'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
      'last_seeded_at',
      now,
    );
    await txn.runAsync(
      'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
      'catalog_size',
      String(plants.length),
    );
  });
}
