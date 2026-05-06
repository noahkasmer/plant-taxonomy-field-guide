import { StyleSheet, Text, View } from 'react-native';

import type { PlantImage } from '@/types/plant';
import { getAttributionText } from '@/utils/mediaRights';

type AttributionProps = {
  image: PlantImage;
};

export function Attribution({ image }: AttributionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>License and Attribution</Text>
      <Text style={styles.text}>{getAttributionText(image)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2E8',
    borderRadius: 12,
    gap: 4,
    padding: 12,
  },
  label: {
    color: '#39523E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  text: {
    color: '#4A5B4D',
    fontSize: 13,
    lineHeight: 19,
  },
});
