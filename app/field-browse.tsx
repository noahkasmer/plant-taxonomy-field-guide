import { Stack } from 'expo-router';

import { FieldModeScreen } from '@/screens/FieldModeScreen';

export default function FieldBrowseRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Browse by Trait' }} />
      <FieldModeScreen />
    </>
  );
}
