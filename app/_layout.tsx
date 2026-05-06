import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F3F0E8',
          },
          headerTintColor: '#1F3D2F',
          contentStyle: {
            backgroundColor: '#F3F0E8',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="identify"
          options={{
            title: 'Start Identification',
          }}
        />
        <Stack.Screen
          name="plants/index"
          options={{
            title: 'Browse Plants',
          }}
        />
        <Stack.Screen
          name="plants/[id]"
          options={{
            title: 'Plant Details',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
