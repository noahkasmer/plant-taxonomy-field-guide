import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  rightLabel?: string;
};

export function SectionHeading({
  title,
  subtitle,
  rightLabel,
}: SectionHeadingProps) {
  const { isDark } = useAppTheme();

  return (
    <View style={tw`mb-3 flex-row items-end justify-between`}>
      <View style={tw`flex-1 pr-3`}>
        <Text style={[tw`text-2xl font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[tw`mt-1 text-sm leading-5`, isDark ? tw`text-stone` : tw`text-bark`]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightLabel ? (
        <Text style={[tw`text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
          {rightLabel}
        </Text>
      ) : null}
    </View>
  );
}
