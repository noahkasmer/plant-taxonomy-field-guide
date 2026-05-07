import type { SQLiteDatabase } from 'expo-sqlite';

import type { ThemePreference } from '@/types/plant';

const THEME_SETTING_KEY = 'theme_preference';

export async function getThemePreferenceAsync(
  db: SQLiteDatabase,
): Promise<ThemePreference> {
  const row = await db.getFirstAsync<{ value: ThemePreference }>(
    'SELECT value FROM settings WHERE key = ?',
    THEME_SETTING_KEY,
  );

  return row?.value ?? 'system';
}

export async function setThemePreferenceAsync(
  db: SQLiteDatabase,
  preference: ThemePreference,
) {
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    THEME_SETTING_KEY,
    preference,
  );
}
