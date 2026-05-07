import { startTransition, useDeferredValue, useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { FilterChip } from '@/components/FilterChip';
import { PlantCard } from '@/components/PlantCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { searchPlants, getActiveFilterCount } from '@/services/searchService';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';

function activeFilterLabels(filters: ReturnType<typeof useAppStore.getState>['filters']) {
  return [
    ...filters.families,
    ...filters.plantTypes,
    ...filters.nativeStatuses,
    ...filters.habitats,
    ...filters.flowerColors,
    ...filters.bloomMonths,
  ];
}

export function SearchScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const filters = useAppStore((state) => state.filters);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const deferredQuery = useDeferredValue(filters.query);

  const results = useMemo(
    () => searchPlants(plantSummaries, { ...filters, query: deferredQuery }),
    [deferredQuery, filters, plantSummaries],
  );

  const activeCount = getActiveFilterCount(filters);
  const chips = activeFilterLabels(filters);

  return (
    <ScreenContainer>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={tw`pb-5`}>
            <SectionHeading
              title="Search"
              subtitle="Find plants by common name, scientific name, family, or field filters."
              rightLabel={`${plantSummaries.length} local plants`}
            />
            <SearchInput
              value={filters.query}
              onChangeText={(value) => {
                startTransition(() => setFilters({ query: value }));
              }}
              placeholder="Search by name, family, or synonym"
            />

            <View style={tw`mt-4 flex-row gap-3`}>
              <View style={tw`flex-1`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push('/filters')}
                  style={({ pressed }) => [
                    tw`rounded-2xl border px-4 py-3`,
                    isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
                    pressed && tw`opacity-80`,
                  ]}
                >
                  <Text style={[tw`text-sm font-semibold`, isDark ? tw`text-sand` : tw`text-moss`]}>
                    Filters {activeCount > 0 ? `(${activeCount})` : ''}
                  </Text>
                </Pressable>
              </View>
              <View style={tw`flex-1`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={resetFilters}
                  style={({ pressed }) => [
                    tw`rounded-2xl border px-4 py-3`,
                    isDark ? tw`border-stone bg-night` : tw`border-stone bg-sand`,
                    pressed && tw`opacity-80`,
                  ]}
                >
                  <Text style={[tw`text-sm font-semibold`, isDark ? tw`text-stone` : tw`text-bark`]}>
                    Clear search
                  </Text>
                </Pressable>
              </View>
            </View>

            {chips.length > 0 ? (
              <View style={tw`mt-4`}>
                <Text style={[tw`mb-2 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
                  Active filters
                </Text>
                <View style={tw`flex-row flex-wrap`}>
                  {chips.map((chip) => (
                    <View key={chip} style={tw`mb-2`}>
                      <FilterChip label={chip} selected />
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <Text style={[tw`mt-4 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              {results.length} result{results.length === 1 ? '' : 's'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={tw`mb-4`}>
            <PlantCard
              plant={item}
              favorite={favoriteIds.includes(item.id)}
              onPress={() => router.push(`/plants/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No plants match this search"
            body="Try a broader family name, clear some filters, or switch to Field Mode for quick visual filtering."
          />
        }
        contentContainerStyle={tw`pb-10`}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
