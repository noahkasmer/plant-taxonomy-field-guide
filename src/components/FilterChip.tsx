import { Pressable, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  highContrast?: boolean;
};

export function FilterChip({
  label,
  selected = false,
  onPress,
  highContrast = false,
}: FilterChipProps) {
  const { isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        tw`mr-2 rounded-full border px-4 py-2`,
        highContrast
          ? selected
            ? tw`border-gold bg-gold`
            : tw`border-sand bg-transparent`
          : selected
            ? isDark
              ? tw`border-fern bg-fern`
              : tw`border-moss bg-moss`
            : isDark
              ? tw`border-stone bg-pine`
              : tw`border-stone bg-white`,
        pressed && tw`opacity-80`,
      ]}
    >
      <Text
        style={[
          tw`text-sm font-semibold`,
          highContrast
            ? selected
              ? tw`text-night`
              : tw`text-sand`
            : selected
              ? tw`text-white`
              : isDark
                ? tw`text-sand`
                : tw`text-moss`,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
