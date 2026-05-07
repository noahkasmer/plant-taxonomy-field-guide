import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDeviceContext } from 'twrnc';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/hooks/useAppTheme';
import { initializeAppAsync } from '@/services/bootstrapApp';
import { useAppStore } from '@/store/appStore';
import tw from '@/theme/tw';

function BootstrapGate() {
  const status = useAppStore((state) => state.status);
  const errorMessage = useAppStore((state) => state.errorMessage);
  const { isDark } = useAppTheme();

  useEffect(() => {
    if (status === 'idle') {
      void initializeAppAsync();
    }
  }, [status]);

  if (status === 'ready') {
    return null;
  }

  return (
    <ScreenContainer>
      <View style={tw`flex-1 items-center justify-center`}>
        <View
          style={[
            tw`w-full rounded-card border p-5`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-2xl font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            {status === 'error' ? 'Local data failed to load' : 'Preparing local field guide'}
          </Text>
          <Text style={[tw`mt-3 text-base leading-7`, isDark ? tw`text-stone` : tw`text-bark`]}>
            {status === 'error'
              ? errorMessage ?? 'The local database could not be initialized.'
              : 'Running migrations, validating bundled data, and loading the offline plant catalog.'}
          </Text>
          {status === 'error' ? (
            <View style={tw`mt-5`}>
              <PrimaryButton label="Retry bootstrap" onPress={() => void initializeAppAsync()} />
            </View>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

function RootNavigator() {
  const status = useAppStore((state) => state.status);
  const { resolvedTheme, palette } = useAppTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  if (status !== 'ready') {
    return <BootstrapGate />;
  }

  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: palette.background,
          },
          headerTintColor: palette.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: palette.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="identify" options={{ title: 'Start Identification' }} />
        <Stack.Screen name="filters" options={{ title: 'Filters', presentation: 'modal' }} />
        <Stack.Screen name="about" options={{ title: 'About & Data Sources' }} />
        <Stack.Screen name="licenses" options={{ title: 'Attribution & Licenses' }} />
        <Stack.Screen name="plants/index" options={{ title: 'Browse Plants' }} />
        <Stack.Screen name="plants/[id]" options={{ title: 'Plant Details' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useDeviceContext(tw);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
