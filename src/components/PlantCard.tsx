import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';
import type { PlantSummary } from '@/types/plant';
import { formatBloomWindow, formatPlantType, formatPlantTitle, formatTraitList } from '@/utils/plants';
import { getBundledPlantImageSource } from '@/utils/imageAssets';
import { OfflineBadge } from '@/components/OfflineBadge';

type PlantCardProps = {
  plant: PlantSummary;
  onPress: () => void;
  mode?: 'default' | 'field';
  favorite?: boolean;
};

export function PlantCard({
  plant,
  onPress,
  mode = 'default',
  favorite = false,
}: PlantCardProps) {
  const { isDark } = useAppTheme();
  const imageSource = plant.heroImage ? getBundledPlantImageSource(plant.heroImage) : null;
  const isField = mode === 'field';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        tw`overflow-hidden rounded-card border`,
        isField
          ? tw`border-sand bg-night`
          : isDark
            ? tw`border-stone bg-pine`
            : tw`border-stone bg-white`,
        pressed && tw`opacity-90`,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          contentFit="cover"
          cachePolicy="memory-disk"
          style={isField ? tw`h-44 w-full` : tw`h-36 w-full`}
        />
      ) : (
        <View
          style={[
            isField ? tw`h-32 w-full items-center justify-center bg-pine` : tw`h-24 w-full items-center justify-center bg-mist`,
          ]}
        >
          <Text style={[tw`text-sm font-semibold uppercase`, isField ? tw`text-sand` : tw`text-moss`]}>
            Awaiting reviewed photo
          </Text>
        </View>
      )}

      <View style={tw`gap-3 p-4`}>
        <View style={tw`flex-row items-start justify-between gap-3`}>
          <View style={tw`flex-1`}>
            <Text
              style={[
                tw.style(isField ? 'text-[24px] leading-7' : 'text-xl leading-7', 'font-bold'),
                isField ? tw`text-sand` : isDark ? tw`text-sand` : tw`text-moss`,
              ]}
            >
              {plant.commonName}
            </Text>
            <Text style={[tw`mt-1 text-sm italic`, isField ? tw`text-stone` : isDark ? tw`text-stone` : tw`text-bark`]}>
              {plant.scientificName}
            </Text>
          </View>
          {favorite ? (
            <View style={tw`rounded-full bg-gold px-3 py-1`}>
              <Text style={tw`text-xs font-bold text-night`}>Saved</Text>
            </View>
          ) : null}
        </View>

        <Text style={[tw`text-xs font-semibold uppercase`, isField ? tw`text-stone` : isDark ? tw`text-stone` : tw`text-smoke`]}>
          {plant.family} • {formatPlantType(plant.plantType)} • {plant.nativeStatus}
        </Text>

        <Text style={[tw`text-sm leading-6`, isField ? tw`text-sand` : isDark ? tw`text-stone` : tw`text-bark`]}>
          {plant.identificationDescription}
        </Text>

        <View style={tw`gap-2`}>
          <Text style={[tw`text-xs font-semibold uppercase`, isField ? tw`text-stone` : isDark ? tw`text-stone` : tw`text-smoke`]}>
            Habitats
          </Text>
          <Text style={[tw`text-sm leading-5`, isField ? tw`text-sand` : isDark ? tw`text-stone` : tw`text-bark`]}>
            {formatTraitList(plant.habitats)}
          </Text>
          <Text style={[tw`text-xs font-semibold uppercase`, isField ? tw`text-stone` : isDark ? tw`text-stone` : tw`text-smoke`]}>
            Bloom
          </Text>
          <Text style={[tw`text-sm leading-5`, isField ? tw`text-sand` : isDark ? tw`text-stone` : tw`text-bark`]}>
            {formatBloomWindow(plant.bloomMonths)} • {formatTraitList(plant.flowerColors)}
          </Text>
        </View>

        <OfflineBadge bundledImageCount={plant.offlineImageCount} />
      </View>
    </Pressable>
  );
}
