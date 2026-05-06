import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';

export function IdentifyScreen() {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Identification workflow coming next</Text>
        <Text style={styles.body}>
          The starter model now captures practical field traits: habitat, flower color, bloom months, leaf
          arrangement and shape, leaf margin, stem character, and height range. The next step is using those traits
          for offline matching.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  title: {
    color: '#1F3D2F',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  body: {
    color: '#4A5B4D',
    fontSize: 16,
    lineHeight: 24,
  },
});
