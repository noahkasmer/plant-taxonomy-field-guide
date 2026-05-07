import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCatalogData } from '@/data/validateCatalog';

test('catalog validation passes and reports MVP-scale counts', () => {
  const summary = validateCatalogData();

  assert.ok(summary.plantCount >= 25);
  assert.ok(summary.bundledImageCount >= 1);
  assert.ok(summary.reviewedImageCandidateCount >= 1);
  assert.ok(summary.sourceCount >= 5);
  assert.ok(summary.licenseCount >= 5);
});
