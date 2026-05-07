import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabsLayout() {
  const { palette, resolvedTheme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.background,
        },
        headerTintColor: palette.text,
        headerShadowVisible: false,
        tabBarPosition: 'top',
        tabBarStyle: {
          backgroundColor: palette.background,
          borderBottomColor: palette.border,
          borderBottomWidth: 1,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSubtle,
        tabBarLabelStyle: {
          fontWeight: '600',
        },
        sceneStyle: {
          backgroundColor: palette.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="sprout" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="field"
        options={{
          title: 'Field',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tune-variant" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
