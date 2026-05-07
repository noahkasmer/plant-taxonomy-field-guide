import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { Attribution } from '@/components/Attribution';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBadge } from '@/components/OfflineBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { toggleFavoriteAsync, recordPlantViewAsync } from '@/services/userActions';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';
import { canUseImageInCommercialApp } from '@/utils/mediaRights';
import {
  formatBloomWindow,
  formatFactSourceList,
  formatFactSummaryMethod,
  formatHeightRange,
  formatImageSourceList,
  formatPlantType,
  formatTraitList,
} from '@/utils/plants';
import { getBundledPlantImageSource } from '@/utils/imageAssets';
import type { PlantImage } from '@/types/plant';

type BundledImageEntry = {
  image: PlantImage;
  source: NonNullable<ReturnType<typeof getBundledPlantImageSource>>;
};

const slotLabels: Record<string, string> = {
  hero: 'Hero',
  detail: 'Flower Detail',
  fruit: 'Fruit / Seed',
  leaf: 'Leaf',
  habitat: 'Habitat',
};

export function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const plantId = Array.isArray(id) ? id[0] : id;
  const plant = useAppStore((state) =>
    plantId ? state.plantDetailsById[plantId] : undefined,
  );
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const isFavorite = plantId ? favoriteIds.includes(plantId) : false;

  useEffect(() => {
    if (!plantId) {
      return;
    }

    void recordPlantViewAsync(plantId);
  }, [plantId]);

  const bundledUsableImages = useMemo(
    () =>
      plant?.images
        .filter((image) => canUseImageInCommercialApp(image))
        .map((image) => {
          const source = getBundledPlantImageSource(image);
          return source ? { image, source } : null;
        })
        .filter((entry): entry is BundledImageEntry => entry !== null) ?? [],
    [plant],
  );

  const showLeafPhotoFallback = useMemo(() => {
    if (!plant) {
      return false;
    }

    const hasLeafImage = bundledUsableImages.some(({ image }) => image.slot === 'leaf');
    const hasOtherStageImages = bundledUsableImages.some(
      ({ image }) => image.slot === 'detail' || image.slot === 'fruit',
    );

    return !hasLeafImage && hasOtherStageImages;
  }, [bundledUsableImages, plant]);

  if (!plant) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: 'Plant Details' }} />
        <EmptyState
          title="Plant not found"
          body="This local record is missing from the current seeded catalog."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: plant.commonName,
        }}
      />
      <ScrollView contentContainerStyle={tw`pb-12`}>
        <View
          style={[
            tw`rounded-card border p-5`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <View style={tw`flex-row items-start justify-between gap-3`}>
            <View style={tw`flex-1`}>
              <Text style={[tw`text-3xl font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
                {plant.commonName}
              </Text>
              <Text style={[tw`mt-2 text-base italic`, isDark ? tw`text-stone` : tw`text-bark`]}>
                {plant.scientificName}
              </Text>
              <Text style={[tw`mt-3 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
                {plant.family} • {formatPlantType(plant.plantType)} • {plant.nativeStatus}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => void toggleFavoriteAsync(plant.id)}
              style={({ pressed }) => [
                tw`rounded-full px-3 py-3`,
                isFavorite ? tw`bg-gold` : isDark ? tw`bg-night` : tw`bg-mist`,
                pressed && tw`opacity-80`,
              ]}
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isFavorite ? '#102019' : isDark ? '#F3F0E8' : '#1F3D2F'}
              />
            </Pressable>
          </View>

          <View style={tw`mt-4`}>
            <OfflineBadge bundledImageCount={plant.offlineImageCount} />
          </View>

          <Text style={[tw`mt-4 text-base leading-7`, isDark ? tw`text-stone` : tw`text-bark`]}>
            {plant.identificationDescription}
          </Text>
        </View>

        <View style={tw`mt-6`}>
          <SectionHeading
            title="Photos"
            subtitle="Only reviewed locally bundled images are shown in the live app."
          />
          {bundledUsableImages.length === 0 ? (
            <View style={[tw`rounded-card border p-5`, isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`]}>
              <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                No reviewed photos are bundled for this plant yet.
              </Text>
            </View>
          ) : (
            bundledUsableImages.map(({ image, source }) => {
              return (
                <View
                  key={image.id}
                  style={[
                    tw`mb-4 overflow-hidden rounded-card border`,
                    isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
                  ]}
                >
                  <Image
                    source={source}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    style={[tw`w-full`, { aspectRatio: 4 / 3, backgroundColor: '#0a1f14' }]}
                  />
                  <View style={tw`gap-3 p-4`}>
                    <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
                      {slotLabels[image.slot] ?? image.slot}
                    </Text>
                    {image.caption ? (
                      <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                        {image.caption}
                      </Text>
                    ) : null}
                    <Attribution image={image} />
                  </View>
                </View>
              );
            })
          )}
          {showLeafPhotoFallback ? (
            <View
              style={[
                tw`mb-4 rounded-card border border-dashed p-4`,
                isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
              ]}
            >
              <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
                Leaf
              </Text>
              <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                No reviewed leaf photo is bundled for this plant yet. Use the leaf description and field traits below for foliage cues.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={tw`mt-2 gap-4`}>
          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Identification" />
            <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              {plant.identificationDescription}
            </Text>
            <Text style={[tw`mt-4 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              Leaves
            </Text>
            <Text style={[tw`mt-1 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              {plant.leafDescription}
            </Text>
            <Text style={[tw`mt-4 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              Flowers
            </Text>
            <Text style={[tw`mt-1 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              {plant.flowerDescription}
            </Text>
          </View>

          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Habitat and bloom" />
            <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              {plant.habitatDescription}
            </Text>
            <Text style={[tw`mt-4 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Habitats: {formatTraitList(plant.habitats)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Bloom time: {formatBloomWindow(plant.bloomMonths)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Height: {formatHeightRange(plant.heightRangeInches)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Field note: {plant.notes}
            </Text>
          </View>

          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Field traits" />
            <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Flower colors: {formatTraitList(plant.flowerColors)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Leaf arrangement: {plant.leafArrangement}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Leaf shape: {plant.leafShape}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Leaf margin: {plant.leafMargin}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Stem type: {plant.stemType}
            </Text>
          </View>

          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Similar species" />
            {plant.similarSpecies.length > 0 ? (
              plant.similarSpecies.map((candidate) => (
                <Pressable
                  key={candidate.id}
                  onPress={() => router.push(`/plants/${candidate.id}`)}
                  style={({ pressed }) => [
                    tw`mb-3 rounded-2xl border px-4 py-3`,
                    isDark ? tw`border-stone bg-night` : tw`border-stone bg-sand`,
                    pressed && tw`opacity-80`,
                  ]}
                >
                  <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
                    {candidate.commonName}
                  </Text>
                  <Text style={[tw`mt-1 text-sm italic`, isDark ? tw`text-stone` : tw`text-bark`]}>
                    {candidate.scientificName}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                Similar-species links have not been curated for this record yet.
              </Text>
            )}
          </View>

          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Range map" />
            <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Illinois range maps are planned for a future release. This MVP uses habitat and family data instead of a live map layer.
            </Text>
          </View>

          <View
            style={[
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
            ]}
          >
            <SectionHeading title="Sources and attribution" />
            <Text style={[tw`text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Referenced fact sources: {formatFactSourceList(plant.factSources)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Summary method: {formatFactSummaryMethod(plant.factSummaryMethod)}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              Image source families: {plant.imageSources.length > 0 ? formatImageSourceList(plant.imageSources) : 'No reviewed image sources recorded yet'}
            </Text>
            {plant.factSourceNotes ? (
              <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                Notes: {plant.factSourceNotes}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
