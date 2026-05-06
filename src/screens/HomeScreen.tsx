import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';

export function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Offline-first MVP</Text>
        <Text style={styles.title}>Illinois Plant ID</Text>
        <Text style={styles.subtitle}>
          A local-first field guide for identifying and browsing Illinois plants without a backend.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Start Identification"
          onPress={() => router.push('/identify')}
        />
        <PrimaryButton
          label="Browse Plants"
          onPress={() => router.push('/plants')}
          tone="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginTop: 28,
  },
  eyebrow: {
    color: '#5A6C5D',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1F3D2F',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
  },
  subtitle: {
    color: '#4A5B4D',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 420,
  },
  actions: {
    gap: 14,
    marginTop: 36,
  },
});
