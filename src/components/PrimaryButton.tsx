import { Pressable, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'ghost';
};

export function PrimaryButton({
  label,
  onPress,
  tone = 'primary',
}: PrimaryButtonProps) {
  const { isDark } = useAppTheme();

  const containerStyle =
    tone === 'primary'
      ? isDark
        ? tw`bg-fern border border-fern`
        : tw`bg-moss border border-moss`
      : tone === 'secondary'
        ? isDark
          ? tw`bg-pine border border-fern`
          : tw`bg-mist border border-fern`
        : tw`bg-transparent border border-transparent`;

  const labelStyle =
    tone === 'primary'
      ? tw`text-white`
      : isDark
        ? tw`text-sand`
        : tw`text-moss`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        tw`min-h-14 w-full items-center justify-center rounded-2xl px-5`,
        containerStyle,
        pressed && tw`opacity-80`,
      ]}
    >
      <Text style={[tw`text-base font-bold`, labelStyle]}>{label}</Text>
    </Pressable>
  );
}
