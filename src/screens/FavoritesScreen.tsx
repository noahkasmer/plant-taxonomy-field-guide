import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PlantCard } from '@/components/PlantCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';

export function FavoritesScreen() {
  const router = useRouter();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const favoriteIds = useAppStore((state) => state.favoriteIds);

  const favorites = favoriteIds
    .map((favoriteId) => plantSummaries.find((plant) => plant.id === favoriteId))
    .filter((plant): plant is NonNullable<typeof plant> => Boolean(plant));

  return (
    <ScreenContainer>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={tw`pb-5`}>
            <SectionHeading
              title="Favorites"
              subtitle="Keep a quick field list of the plants you want to revisit most often."
              rightLabel={`${favorites.length} saved`}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={tw`mb-4`}>
            <PlantCard
              plant={item}
              favorite
              onPress={() => router.push(`/plants/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No favorites yet"
            body="Save plants from the detail page to keep a quick personal shortlist for field trips."
          />
        }
        contentContainerStyle={tw`pb-10`}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
