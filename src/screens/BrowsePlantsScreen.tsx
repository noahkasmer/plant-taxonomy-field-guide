import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { plants } from '@/data/plants';
import {
  formatFactSourceList,
  formatHeightRange,
  formatPlantTitle,
  formatTraitList,
} from '@/utils/plants';

export function BrowsePlantsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.list}>
        {plants.map((plant) => (
          <Pressable
            key={plant.id}
            accessibilityRole="button"
            onPress={() => router.push(`/plants/${plant.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.title}>{formatPlantTitle(plant)}</Text>
            <Text style={styles.meta}>{plant.family} - {plant.nativeStatus}</Text>
            <Text style={styles.body}>Habitats: {formatTraitList(plant.habitats)}</Text>
            <Text style={styles.body}>Flower colors: {formatTraitList(plant.flowerColors)}</Text>
            <Text style={styles.body}>Bloom months: {formatTraitList(plant.bloomMonths)}</Text>
            <Text style={styles.body}>
              Leaf: {plant.leafArrangement}, {plant.leafShape}, {plant.leafMargin}
            </Text>
            <Text style={styles.body}>Stem: {plant.stemType}</Text>
            <Text style={styles.body}>Height: {formatHeightRange(plant.heightRangeInches)}</Text>
            <Text style={styles.body}>Referenced fact sources: {formatFactSourceList(plant.factSources)}</Text>
            <Text style={styles.body}>Tap for details</Text>
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
});
