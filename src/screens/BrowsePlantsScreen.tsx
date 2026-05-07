import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useSearchablePlants } from '@/hooks/usePlantRepository';
import {
  formatHeightRange,
  formatPlantTitle,
  formatTraitList,
} from '@/utils/plants';

export function BrowsePlantsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { plants, isLoading, error } = useSearchablePlants(searchQuery);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Search the offline field guide</Text>
          <TextInput
            accessibilityLabel="Search plants"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            placeholder="Common name, family, habitat, feature..."
            placeholderTextColor="#7A887A"
            style={styles.searchInput}
            value={searchQuery}
          />
          <Text style={styles.searchHint}>
            {isLoading ? 'Loading local SQLite records...' : `${plants.length} native Illinois plants found`}
          </Text>
        </View>

        {error ? (
          <View style={styles.card}>
            <Text style={styles.title}>Unable to load plants</Text>
            <Text style={styles.body}>{error.message}</Text>
          </View>
        ) : null}

        {!isLoading && !error && plants.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.title}>No matches</Text>
            <Text style={styles.body}>Try searching by a plant name, family, habitat, bloom season, or field mark.</Text>
          </View>
        ) : null}

        {plants.map((plant) => (
          <Pressable
            key={plant.id}
            accessibilityRole="button"
            onPress={() => router.push(`/plants/${plant.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.title}>{formatPlantTitle(plant)}</Text>
            <Text style={styles.meta}>{plant.family} - {plant.nativeStatus}</Text>
            <Text style={styles.body}>Bloom season: {plant.bloomSeason}</Text>
            <Text style={styles.body}>Habitats: {formatTraitList(plant.habitats)}</Text>
            <Text style={styles.body}>Height: {formatHeightRange(plant.heightRangeInches)}</Text>
            <Text style={styles.body}>Key features: {plant.identifyingFeatures.slice(0, 2).join('; ')}</Text>
            <Text style={styles.linkText}>Tap for details</Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
    paddingBottom: 32,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  searchLabel: {
    color: '#1F3D2F',
    fontSize: 18,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#F7F8F3',
    borderColor: '#C9D5C2',
    borderRadius: 12,
    borderWidth: 1,
    color: '#1F3D2F',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchHint: {
    color: '#5E6F60',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  cardPressed: {
    opacity: 0.88,
  },
  title: {
    color: '#1F3D2F',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  meta: {
    color: '#5E6F60',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  body: {
    color: '#4A5B4D',
    fontSize: 15,
    lineHeight: 22,
  },
  linkText: {
    color: '#2F6847',
    fontSize: 15,
    fontWeight: '700',
  },
});
