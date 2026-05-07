import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type OfflineBadgeProps = {
  bundledImageCount: number;
};

export function OfflineBadge({ bundledImageCount }: OfflineBadgeProps) {
  const { isDark } = useAppTheme();

  return (
    <View
      style={[
        tw`rounded-full px-3 py-1`,
        isDark ? tw`bg-fern` : tw`bg-mist`,
      ]}
    >
      <Text style={[tw`text-xs font-semibold`, isDark ? tw`text-sand` : tw`text-moss`]}>
        Offline ready • {bundledImageCount} cached image{bundledImageCount === 1 ? '' : 's'}
      </Text>
    </View>
  );
}
