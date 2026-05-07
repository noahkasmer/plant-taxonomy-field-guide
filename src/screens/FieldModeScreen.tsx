import { startTransition, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { FilterChip } from '@/components/FilterChip';
import { PlantCard } from '@/components/PlantCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeading } from '@/components/SectionHeading';
import { searchPlants } from '@/services/searchService';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';
import type {
  BloomMonth,
  FlowerColor,
  Habitat,
  LeafArrangement,
  LeafMargin,
  LeafShape,
  PlantSummary,
  StemType,
} from '@/types/plant';
import { bloomMonthOrder } from '@/utils/months';

type TraitFilters = {
  query: string;
  habitats: Habitat[];
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  leafArrangements: LeafArrangement[];
  leafShapes: LeafShape[];
  leafMargins: LeafMargin[];
  stemTypes: StemType[];
};

const initialTraitFilters: TraitFilters = {
  query: '',
  habitats: [],
  flowerColors: [],
  bloomMonths: [],
  leafArrangements: [],
  leafShapes: [],
  leafMargins: [],
  stemTypes: [],
};

function toggleListValue<T extends string>(current: T[], value: T) {
  return current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];
}

function matchesFieldTraits(plant: PlantSummary, detail: ReturnType<typeof useAppStore.getState>['plantDetailsById'][string], filters: TraitFilters) {
  if (
    filters.habitats.length > 0 &&
    !filters.habitats.some((habitat) => plant.habitats.includes(habitat))
  ) {
    return false;
  }

  if (
    filters.flowerColors.length > 0 &&
    !filters.flowerColors.some((color) => plant.flowerColors.includes(color))
  ) {
    return false;
  }

  if (
    filters.bloomMonths.length > 0 &&
    !filters.bloomMonths.some((month) => plant.bloomMonths.includes(month))
  ) {
    return false;
  }

  if (
    filters.leafArrangements.length > 0 &&
    !filters.leafArrangements.includes(detail.leafArrangement)
  ) {
    return false;
  }

  if (filters.leafShapes.length > 0 && !filters.leafShapes.includes(detail.leafShape)) {
    return false;
  }

  if (filters.leafMargins.length > 0 && !filters.leafMargins.includes(detail.leafMargin)) {
    return false;
  }

  if (filters.stemTypes.length > 0 && !filters.stemTypes.includes(detail.stemType)) {
    return false;
  }

  return true;
}

function traitOptionsFromCatalog<T extends string>(values: T[]) {
  return [...new Set(values)].sort();
}

export function FieldModeScreen() {
  const router = useRouter();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const plantDetailsById = useAppStore((state) => state.plantDetailsById);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const [filters, setFilters] = useState<TraitFilters>(initialTraitFilters);

  const habitatOptions = useMemo(
    () => traitOptionsFromCatalog(plantSummaries.flatMap((plant) => plant.habitats)),
    [plantSummaries],
  );
  const colorOptions = useMemo(
    () => traitOptionsFromCatalog(plantSummaries.flatMap((plant) => plant.flowerColors)),
    [plantSummaries],
  );
  const monthOptions = useMemo(
    () =>
      [...new Set(plantSummaries.flatMap((plant) => plant.bloomMonths))].sort(
        (left, right) =>
          bloomMonthOrder.indexOf(left) - bloomMonthOrder.indexOf(right),
      ),
    [plantSummaries],
  );
  const leafArrangementOptions = useMemo(
    () =>
      traitOptionsFromCatalog(
        Object.values(plantDetailsById).map((plant) => plant.leafArrangement),
      ),
    [plantDetailsById],
  );
  const leafShapeOptions = useMemo(
    () =>
      traitOptionsFromCatalog(
        Object.values(plantDetailsById).map((plant) => plant.leafShape),
      ),
    [plantDetailsById],
  );
  const leafMarginOptions = useMemo(
    () =>
      traitOptionsFromCatalog(
        Object.values(plantDetailsById).map((plant) => plant.leafMargin),
      ),
    [plantDetailsById],
  );
  const stemTypeOptions = useMemo(
    () =>
      traitOptionsFromCatalog(
        Object.values(plantDetailsById).map((plant) => plant.stemType),
      ),
    [plantDetailsById],
  );

  const filteredPlants = useMemo(() => {
    const baseResults = searchPlants(plantSummaries, {
      query: filters.query,
      flowerColors: filters.flowerColors,
      bloomMonths: filters.bloomMonths,
      habitats: filters.habitats,
      plantTypes: [],
      nativeStatuses: [],
      families: [],
    });

    return baseResults.filter((plant) =>
      matchesFieldTraits(plant, plantDetailsById[plant.id], filters),
    );
  }, [filters, plantDetailsById, plantSummaries]);

  const renderChipSection = <T extends string>(
    title: string,
    options: T[],
    selected: T[],
    onToggle: (value: T) => void,
  ) => (
    <View style={tw`mb-5`}>
      <Text style={tw`mb-2 text-xs font-semibold uppercase text-stone`}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`flex-row pr-4`}>
          {options.map((option) => (
            <FilterChip
              key={option}
              label={option}
              selected={selected.includes(option)}
              onPress={() => onToggle(option)}
              highContrast
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={tw`pb-5`}>
            <SectionHeading
              title="Field Mode"
              subtitle="Large targets, high contrast, and trait-first filtering for quick outdoor identification."
              rightLabel={`${filteredPlants.length} matches`}
            />

            <SearchInput
              value={filters.query}
              onChangeText={(value) => {
                startTransition(() => {
                  setFilters((current) => ({
                    ...current,
                    query: value,
                  }));
                });
              }}
              placeholder="Search within field mode"
            />

            <View style={tw`mt-5 rounded-card bg-night p-4`}>
              {renderChipSection('Habitats', habitatOptions, filters.habitats, (value) =>
                setFilters((current) => ({
                  ...current,
                  habitats: toggleListValue(current.habitats, value),
                })),
              )}
              {renderChipSection('Flower colors', colorOptions, filters.flowerColors, (value) =>
                setFilters((current) => ({
                  ...current,
                  flowerColors: toggleListValue(current.flowerColors, value),
                })),
              )}
              {renderChipSection('Bloom months', monthOptions, filters.bloomMonths, (value) =>
                setFilters((current) => ({
                  ...current,
                  bloomMonths: toggleListValue(current.bloomMonths, value),
                })),
              )}
              {renderChipSection(
                'Leaf arrangement',
                leafArrangementOptions,
                filters.leafArrangements,
                (value) =>
                  setFilters((current) => ({
                    ...current,
                    leafArrangements: toggleListValue(current.leafArrangements, value),
                  })),
              )}
              {renderChipSection('Leaf shape', leafShapeOptions, filters.leafShapes, (value) =>
                setFilters((current) => ({
                  ...current,
                  leafShapes: toggleListValue(current.leafShapes, value),
                })),
              )}
              {renderChipSection('Leaf margin', leafMarginOptions, filters.leafMargins, (value) =>
                setFilters((current) => ({
                  ...current,
                  leafMargins: toggleListValue(current.leafMargins, value),
                })),
              )}
              {renderChipSection('Stem type', stemTypeOptions, filters.stemTypes, (value) =>
                setFilters((current) => ({
                  ...current,
                  stemTypes: toggleListValue(current.stemTypes, value),
                })),
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={tw`mb-5`}>
            <PlantCard
              plant={item}
              mode="field"
              favorite={favoriteIds.includes(item.id)}
              onPress={() => router.push(`/plants/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No field matches"
            body="Try removing one or two traits. Field Mode is intentionally strict when you stack multiple visual filters."
          />
        }
        contentContainerStyle={tw`pb-12`}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
