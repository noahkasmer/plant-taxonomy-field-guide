import test from 'node:test';
import assert from 'node:assert/strict';

import { getCatalogBootstrapAsync } from '@/db/repositories/catalogRepository';
import { createSeededTestDatabaseAsync } from '../helpers/seedCatalog';

test('migrations and seed create the expected catalog tables and rows', async () => {
  const db = await createSeededTestDatabaseAsync();

  const plantCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM plants',
  );
  const imageCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM images',
  );
  const sourceCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sources',
  );

  assert.equal(plantCount?.count, 31);
  assert.ok((imageCount?.count ?? 0) >= 1);
  assert.ok((sourceCount?.count ?? 0) >= 5);

  await db.closeAsync();
});

test('catalog bootstrap hydrates plant details from SQLite rows', async () => {
  const db = await createSeededTestDatabaseAsync();
  const snapshot = await getCatalogBootstrapAsync(db as never);
  const blackEyedSusan = snapshot.details.find((plant) => plant.id === 'black-eyed-susan');

  assert.ok(blackEyedSusan);
  assert.equal(blackEyedSusan?.commonName, 'Black-Eyed Susan');
  assert.ok((blackEyedSusan?.images.length ?? 0) >= 1);
  assert.ok(blackEyedSusan?.factSources.includes('USDA_PLANTS'));

  await db.closeAsync();
});
