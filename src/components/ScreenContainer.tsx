import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type ScreenContainerProps = PropsWithChildren<{
  padded?: boolean;
}>;

export function ScreenContainer({
  children,
  padded = true,
}: ScreenContainerProps) {
  const { isDark } = useAppTheme();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[tw`flex-1`, isDark ? tw`bg-night` : tw`bg-sand`]}
    >
      <View
        style={[
          tw`flex-1`,
          padded ? tw`px-5 py-5` : tw`py-5`,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
