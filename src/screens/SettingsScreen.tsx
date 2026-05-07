import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  clearImageCachesAsync,
  resetOfflineDataAsync,
  saveThemePreferenceAsync,
} from '@/services/userActions';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';
import type { ThemePreference } from '@/types/plant';

export function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const themePreference = useAppStore((state) => state.themePreference);
  const stats = useAppStore((state) => state.stats);

  const themeOptions: ThemePreference[] = ['system', 'light', 'dark'];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <SectionHeading
          title="Settings"
          subtitle="Manage theme, offline data, cached images, and transparency pages."
        />

        <View
          style={[
            tw`mb-5 rounded-card border p-4`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Theme
          </Text>
          <View style={tw`mt-3 flex-row flex-wrap`}>
            {themeOptions.map((option) => {
              const selected = themePreference === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => void saveThemePreferenceAsync(option)}
                  style={({ pressed }) => [
                    tw`mb-2 mr-2 rounded-full border px-4 py-2`,
                    selected
                      ? tw`border-moss bg-moss`
                      : isDark
                        ? tw`border-stone bg-night`
                        : tw`border-stone bg-sand`,
                    pressed && tw`opacity-80`,
                  ]}
                >
                  <Text style={[tw`text-sm font-semibold capitalize`, selected ? tw`text-white` : isDark ? tw`text-sand` : tw`text-moss`]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            tw`mb-5 rounded-card border p-4`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Offline data
          </Text>
          <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
            Plants: {stats?.plantCount ?? 0} | Bundled images: {stats?.bundledImageCount ?? 0} | Seed version:{' '}
            {stats?.seedVersion ?? 'pending'}
          </Text>
          <Text style={[tw`mt-1 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
            Last seeded: {stats?.lastSeededAt ? new Date(stats.lastSeededAt).toLocaleString() : 'pending'}
          </Text>
          <View style={tw`mt-4 gap-3`}>
            <PrimaryButton
              label="Clear image cache"
              tone="secondary"
              onPress={() => void clearImageCachesAsync()}
            />
            <PrimaryButton
              label="Rebuild local database"
              onPress={() =>
                Alert.alert(
                  'Rebuild local database?',
                  'This will wipe favorites and recents stored on this device, then reseed the local catalog.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Rebuild',
                      style: 'destructive',
                      onPress: () => void resetOfflineDataAsync(),
                    },
                  ],
                )
              }
            />
          </View>
        </View>

        <View
          style={[
            tw`rounded-card border p-4`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Transparency
          </Text>
          <View style={tw`mt-4 gap-3`}>
            <PrimaryButton
              label="About and data sources"
              tone="secondary"
              onPress={() => router.push('/about')}
            />
            <PrimaryButton
              label="Attribution and licenses"
              tone="secondary"
              onPress={() => router.push('/licenses')}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
