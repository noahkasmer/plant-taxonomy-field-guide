import { getCatalogBootstrapAsync } from '@/db/repositories/catalogRepository';
import { runMigrationsAsync } from '@/db/migrations';
import { seedDatabaseAsync } from '@/db/seed';
import { NodeTestDatabase } from '../tests/helpers/nodeTestDatabase';

async function main() {
  const db = new NodeTestDatabase();
  await runMigrationsAsync(db as never);
  await seedDatabaseAsync(db as never);
  const snapshot = await getCatalogBootstrapAsync(db as never);

  console.log(
    JSON.stringify(
      {
        ok: true,
        plantCount: snapshot.summaries.length,
        firstPlant: snapshot.summaries[0]?.id ?? null,
        hasFavoritesTable: Boolean(
          await db.getFirstAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'favorites'",
          ),
        ),
      },
      null,
      2,
    ),
  );

  await db.closeAsync();
}

void main();
