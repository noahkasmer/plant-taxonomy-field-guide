import {
  deleteDatabaseAsync,
  openDatabaseAsync,
  type SQLiteDatabase,
} from 'expo-sqlite';

import { DATABASE_NAME } from '@/db/constants';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabaseAsync() {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function closeDatabaseAsync() {
  if (!databasePromise) {
    return;
  }

  const db = await databasePromise;
  await db.closeAsync();
  databasePromise = null;
}

export async function resetDatabaseAsync() {
  await closeDatabaseAsync();
  await deleteDatabaseAsync(DATABASE_NAME);
}
