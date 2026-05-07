import { Stack, useLocalSearchParams } from 'expo-router';

import { FieldKeyScreen } from '@/screens/FieldKeyScreen';

export default function IdentifyKeyRoute() {
  const { seeds } = useLocalSearchParams<{ seeds?: string }>();
  const seedPlantIds = seeds ? seeds.split(',').filter(Boolean) : undefined;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FieldKeyScreen seedPlantIds={seedPlantIds} />
    </>
  );
}
