import { getCatalogBootstrapAsync } from '@/db/repositories/catalogRepository';
import { runMigrationsAsync } from '@/db/migrations';
import { seedDatabaseAsync } from '@/db/seed';

import { NodeTestDatabase } from './nodeTestDatabase';

export async function createSeededTestDatabaseAsync() {
  const db = new NodeTestDatabase();
  await runMigrationsAsync(db as never);
  await seedDatabaseAsync(db as never);
  return db;
}

export async function createCatalogSnapshotForTests() {
  const db = await createSeededTestDatabaseAsync();
  const snapshot = await getCatalogBootstrapAsync(db as never);
  return { db, snapshot };
}
