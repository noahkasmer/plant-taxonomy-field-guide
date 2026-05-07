import test from 'node:test';
import assert from 'node:assert/strict';

import { searchPlants } from '@/services/searchService';
import { createCatalogSnapshotForTests } from '../helpers/seedCatalog';

test('search ranks exact common-name matches first', async () => {
  const { db, snapshot } = await createCatalogSnapshotForTests();

  const results = searchPlants(snapshot.summaries, {
    query: 'black-eyed susan',
    flowerColors: [],
    bloomMonths: [],
    habitats: [],
    plantTypes: [],
    nativeStatuses: [],
    families: [],
  });

  assert.equal(results[0]?.id, 'black-eyed-susan');
  await db.closeAsync();
});

test('search supports family lookups with filter combinations', async () => {
  const { db, snapshot } = await createCatalogSnapshotForTests();

  const results = searchPlants(snapshot.summaries, {
    query: 'asteraceae',
    flowerColors: ['yellow'],
    bloomMonths: ['August'],
    habitats: ['prairie'],
    plantTypes: [],
    nativeStatuses: ['native'],
    families: [],
  });

  assert.ok(results.some((plant) => plant.id === 'prairie-dock'));
  assert.ok(results.every((plant) => plant.nativeStatus === 'native'));
  await db.closeAsync();
});
