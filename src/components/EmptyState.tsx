import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  const { isDark } = useAppTheme();

  return (
    <View
      style={[
        tw`items-center rounded-card border px-6 py-8`,
        isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
      ]}
    >
      <Text style={[tw`text-lg font-bold text-center`, isDark ? tw`text-sand` : tw`text-moss`]}>
        {title}
      </Text>
      <Text style={[tw`mt-2 text-center text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
        {body}
      </Text>
    </View>
  );
}
