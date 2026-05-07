import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PlantCard } from '@/components/PlantCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';

export function HomeScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const recentPlantIds = useAppStore((state) => state.recentPlantIds);
  const stats = useAppStore((state) => state.stats);

  const recentPlants = recentPlantIds
    .map((id) => plantSummaries.find((plant) => plant.id === id))
    .filter((plant): plant is NonNullable<typeof plant> => Boolean(plant))
    .slice(0, 3);

  const favoritePlants = favoriteIds
    .map((id) => plantSummaries.find((plant) => plant.id === id))
    .filter((plant): plant is NonNullable<typeof plant> => Boolean(plant))
    .slice(0, 2);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <View
          style={[
            tw`rounded-card border p-5`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
            Offline-first field guide
          </Text>
          <Text style={[tw`mt-2 text-4xl font-bold leading-tight`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Illinois Plant ID
          </Text>
          <Text style={[tw`mt-3 text-base leading-7`, isDark ? tw`text-stone` : tw`text-bark`]}>
            A practical native plant field guide built for quick outdoor lookup, locally stored catalog data, and conservative image rights handling.
          </Text>

          <View style={tw`mt-5 gap-3`}>
            <PrimaryButton
              label="Start Identification"
              onPress={() => router.push('/identify')}
            />
            <PrimaryButton
              label="Browse Plants"
              tone="secondary"
              onPress={() => router.push('/search')}
            />
          </View>
        </View>

        <View style={tw`mt-6 flex-row flex-wrap justify-between`}>
          <View
            style={[
              tw`mb-3 w-[48%] rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              Local plants
            </Text>
            <Text style={[tw`mt-2 text-3xl font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
              {stats?.plantCount ?? 0}
            </Text>
          </View>
          <View
            style={[
              tw`mb-3 w-[48%] rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              Bundled images
            </Text>
            <Text style={[tw`mt-2 text-3xl font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
              {stats?.bundledImageCount ?? 0}
            </Text>
          </View>
        </View>

        <View style={tw`mt-4`}>
          <SectionHeading
            title="Recently viewed"
            subtitle="Fast return path for plants you already checked in the field."
          />
          {recentPlants.length > 0 ? (
            recentPlants.map((plant) => (
              <View key={plant.id} style={tw`mb-4`}>
                <PlantCard
                  plant={plant}
                  favorite={favoriteIds.includes(plant.id)}
                  onPress={() => router.push(`/plants/${plant.id}`)}
                />
              </View>
            ))
          ) : (
            <EmptyState
              title="Nothing viewed yet"
              body="Open a plant detail page and it will appear here for faster return visits."
            />
          )}
        </View>

        <View style={tw`mt-6`}>
          <SectionHeading
            title="Saved plants"
            subtitle="Favorites become a lightweight shortlist for repeat field trips."
          />
          {favoritePlants.length > 0 ? (
            favoritePlants.map((plant) => (
              <View key={plant.id} style={tw`mb-4`}>
                <PlantCard
                  plant={plant}
                  favorite
                  onPress={() => router.push(`/plants/${plant.id}`)}
                />
              </View>
            ))
          ) : (
            <EmptyState
              title="No saved plants"
              body="Use the bookmark button on a plant detail page to build your own shortlist."
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
