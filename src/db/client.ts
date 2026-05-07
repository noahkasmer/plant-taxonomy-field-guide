import * as SQLite from 'expo-sqlite';

import { DATABASE_NAME } from '@/db/constants';
import type { DatabaseHandle, SQLiteModuleWithDelete } from '@/db/types';

const sqliteModule = SQLite as SQLiteModuleWithDelete;
let databasePromise: Promise<DatabaseHandle> | null = null;

export function getDatabaseAsync() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME) as Promise<DatabaseHandle>;
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
  await sqliteModule.deleteDatabaseAsync(DATABASE_NAME);
}
