import type { DatabaseHandle } from '@/db/types';

export async function getFavoritePlantIdsAsync(db: DatabaseHandle) {
  const rows = await db.getAllAsync<{ plant_id: string }>(
    'SELECT plant_id FROM favorites ORDER BY created_at DESC',
  );

  return rows.map((row) => row.plant_id);
}

export async function toggleFavoritePlantAsync(db: DatabaseHandle, plantId: string) {
  const existing = await db.getFirstAsync<{ plant_id: string }>(
    'SELECT plant_id FROM favorites WHERE plant_id = ?',
    [plantId],
  );

  if (existing) {
    await db.runAsync('DELETE FROM favorites WHERE plant_id = ?', [plantId]);
    return false;
  }

  await db.runAsync(
    'INSERT INTO favorites (plant_id, created_at) VALUES (?, ?)',
    [plantId, new Date().toISOString()],
  );
  return true;
}

export async function getRecentlyViewedPlantIdsAsync(db: DatabaseHandle) {
  const rows = await db.getAllAsync<{ plant_id: string }>(
    'SELECT plant_id FROM recently_viewed ORDER BY viewed_at DESC LIMIT 12',
  );

  return rows.map((row) => row.plant_id);
}

export async function recordPlantViewAsync(db: DatabaseHandle, plantId: string) {
  await db.runAsync(
    'INSERT OR REPLACE INTO recently_viewed (plant_id, viewed_at) VALUES (?, ?)',
    [plantId, new Date().toISOString()],
  );
}
