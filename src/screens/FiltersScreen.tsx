import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FilterChip } from '@/components/FilterChip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';

export function FiltersScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const filterOptions = useAppStore((state) => state.filterOptions);
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);

  const toggleArrayValue = <T extends string>(key: keyof typeof filters, value: T) => {
    const current = filters[key] as T[];
    setFilters({
      [key]: current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    });
  };

  const renderSection = <T extends string>(
    title: string,
    filterKey: keyof typeof filters,
    values: T[],
  ) => (
    <View style={tw`mb-6`}>
      <Text style={[tw`mb-2 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
        {title}
      </Text>
      <View style={tw`flex-row flex-wrap`}>
        {values.map((value) => (
          <View key={value} style={tw`mb-2`}>
            <FilterChip
              label={value}
              selected={(filters[filterKey] as T[]).includes(value)}
              onPress={() => toggleArrayValue(filterKey, value)}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <SectionHeading
          title="Filters"
          subtitle="Tune the catalog by season, habitat, family, color, plant type, and native status."
        />

        {renderSection('Flower color', 'flowerColors', filterOptions.flowerColors)}
        {renderSection('Bloom months', 'bloomMonths', filterOptions.bloomMonths)}
        {renderSection('Habitats', 'habitats', filterOptions.habitats)}
        {renderSection('Plant type', 'plantTypes', filterOptions.plantTypes)}
        {renderSection('Native status', 'nativeStatuses', filterOptions.nativeStatuses)}
        {renderSection('Family', 'families', filterOptions.families)}

        <View style={tw`mt-2 gap-3`}>
          <PrimaryButton label="Apply filters" onPress={() => router.back()} />
          <PrimaryButton label="Reset filters" tone="secondary" onPress={resetFilters} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
