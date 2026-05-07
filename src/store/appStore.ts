import { create } from 'zustand';

import type {
  AppDataStats,
  CatalogFilterOptions,
  CatalogFilters,
  PlantDetail,
  PlantSummary,
  ThemePreference,
} from '@/types/plant';

export type BootstrapSnapshot = {
  plantSummaries: PlantSummary[];
  plantDetails: PlantDetail[];
  filterOptions: CatalogFilterOptions;
  favoriteIds: string[];
  recentPlantIds: string[];
  themePreference: ThemePreference;
  stats: AppDataStats;
};

const emptyFilters: CatalogFilters = {
  query: '',
  flowerColors: [],
  bloomMonths: [],
  habitats: [],
  plantTypes: [],
  nativeStatuses: [],
  families: [],
};

type AppState = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage: string | null;
  plantSummaries: PlantSummary[];
  plantDetailsById: Record<string, PlantDetail>;
  filterOptions: CatalogFilterOptions;
  filters: CatalogFilters;
  favoriteIds: string[];
  recentPlantIds: string[];
  themePreference: ThemePreference;
  stats: AppDataStats | null;
  setStatus: (status: AppState['status']) => void;
  setErrorMessage: (message: string | null) => void;
  hydrate: (snapshot: BootstrapSnapshot) => void;
  setFilters: (updater: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  setFavoriteIds: (favoriteIds: string[]) => void;
  setRecentPlantIds: (recentPlantIds: string[]) => void;
  setThemePreferenceLocal: (themePreference: ThemePreference) => void;
};

const emptyFilterOptions: CatalogFilterOptions = {
  flowerColors: [],
  bloomMonths: [],
  habitats: [],
  plantTypes: [],
  nativeStatuses: [],
  families: [],
};

function toDetailsById(details: PlantDetail[]) {
  return Object.fromEntries(details.map((detail) => [detail.id, detail]));
}

export const useAppStore = create<AppState>((set) => ({
  status: 'idle',
  errorMessage: null,
  plantSummaries: [],
  plantDetailsById: {},
  filterOptions: emptyFilterOptions,
  filters: emptyFilters,
  favoriteIds: [],
  recentPlantIds: [],
  themePreference: 'system',
  stats: null,
  setStatus: (status) => set({ status }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  hydrate: (snapshot) =>
    set({
      status: 'ready',
      errorMessage: null,
      plantSummaries: snapshot.plantSummaries,
      plantDetailsById: toDetailsById(snapshot.plantDetails),
      filterOptions: snapshot.filterOptions,
      favoriteIds: snapshot.favoriteIds,
      recentPlantIds: snapshot.recentPlantIds,
      themePreference: snapshot.themePreference,
      stats: snapshot.stats,
    }),
  setFilters: (updater) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updater,
      },
    })),
  resetFilters: () => set({ filters: emptyFilters }),
  setFavoriteIds: (favoriteIds) => set({ favoriteIds }),
  setRecentPlantIds: (recentPlantIds) => set({ recentPlantIds }),
  setThemePreferenceLocal: (themePreference) => set({ themePreference }),
}));
