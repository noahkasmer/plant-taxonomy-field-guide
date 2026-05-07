import { Platform } from 'react-native';
import { Image } from 'expo-image';

import { getDatabaseAsync, resetDatabaseAsync } from '@/db/client';
import { setThemePreferenceAsync } from '@/db/repositories/settingsRepository';
import {
  getFavoritePlantIdsAsync,
  getRecentlyViewedPlantIdsAsync,
  recordPlantViewAsync as recordPlantViewInDbAsync,
  toggleFavoritePlantAsync,
} from '@/db/repositories/userDataRepository';
import { initializeAppAsync } from '@/services/bootstrapApp';
import { useAppStore } from '@/store/appStore';
import type { ThemePreference } from '@/types/plant';

export async function toggleFavoriteAsync(plantId: string) {
  if (Platform.OS === 'web') {
    const current = useAppStore.getState().favoriteIds;
    const next = current.includes(plantId)
      ? current.filter((id) => id !== plantId)
      : [plantId, ...current];
    useAppStore.getState().setFavoriteIds(next);
    return;
  }

  const db = await getDatabaseAsync();
  await toggleFavoritePlantAsync(db, plantId);
  const favoriteIds = await getFavoritePlantIdsAsync(db);
  useAppStore.getState().setFavoriteIds(favoriteIds);
}

export async function recordPlantViewAsync(plantId: string) {
  if (Platform.OS === 'web') {
    const current = useAppStore.getState().recentPlantIds.filter((id) => id !== plantId);
    useAppStore.getState().setRecentPlantIds([plantId, ...current].slice(0, 10));
    return;
  }

  const db = await getDatabaseAsync();
  await recordPlantViewInDbAsync(db, plantId);
  const recentPlantIds = await getRecentlyViewedPlantIdsAsync(db);
  useAppStore.getState().setRecentPlantIds(recentPlantIds);
}

export async function saveThemePreferenceAsync(preference: ThemePreference) {
  if (Platform.OS === 'web') {
    useAppStore.getState().setThemePreferenceLocal(preference);
    return;
  }

  const db = await getDatabaseAsync();
  await setThemePreferenceAsync(db, preference);
  useAppStore.getState().setThemePreferenceLocal(preference);
}

export async function clearImageCachesAsync() {
  await Promise.all([Image.clearDiskCache(), Image.clearMemoryCache()]);
}

export async function resetOfflineDataAsync() {
  if (Platform.OS === 'web') {
    await initializeAppAsync();
    return;
  }

  await resetDatabaseAsync();
  await initializeAppAsync();
}
