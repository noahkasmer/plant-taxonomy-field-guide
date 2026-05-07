import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';
import type { PlantImage } from '@/types/plant';
import { getAttributionText } from '@/utils/mediaRights';

type AttributionProps = {
  image: PlantImage;
};

export function Attribution({ image }: AttributionProps) {
  const { isDark } = useAppTheme();

  return (
    <View
      style={[
        tw`rounded-2xl p-3`,
        isDark ? tw`bg-pine` : tw`bg-lake`,
      ]}
    >
      <Text style={[tw`text-xs font-bold uppercase tracking-wide`, isDark ? tw`text-mist` : tw`text-fern`]}>
        License and attribution
      </Text>
      <Text style={[tw`mt-1 text-sm leading-5`, isDark ? tw`text-sand` : tw`text-bark`]}>
        {getAttributionText(image)}
      </Text>
    </View>
  );
}
