import { useColorScheme } from 'react-native';

import { palettes } from '@/theme/palette';
import { useAppStore } from '@/store/appStore';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);
  const resolvedTheme =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  return {
    themePreference,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    palette: palettes[resolvedTheme],
  };
}
