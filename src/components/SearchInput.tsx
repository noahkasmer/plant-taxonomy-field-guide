import { TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search plants',
}: SearchInputProps) {
  const { isDark, palette } = useAppTheme();

  return (
    <View
      style={[
        tw`flex-row items-center rounded-card border px-4 py-3`,
        isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={isDark ? palette.textSubtle : palette.textMuted}
      />
      <TextInput
        accessibilityLabel="Search plants"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textSubtle}
        style={[
          tw`ml-3 flex-1 text-base`,
          { color: palette.text },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}
