import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type HowToUseCardProps = {
  onStart: () => void;
  onOpenGlossary: () => void;
};

export function HowToUseCard({ onStart, onOpenGlossary }: HowToUseCardProps) {
  const { palette, isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: palette.textSubtle }]}>How to use this key</Text>
        <Text style={[styles.title, { color: palette.text }]}>Identify a Plant</Text>
        <Text style={[styles.body, { color: palette.textMuted }]}>
          This is a <Text style={[styles.bold, { color: palette.text }]}>guided dichotomous key</Text> - a classic field guide tool
          that narrows down a plant one question at a time.
        </Text>

        <View style={styles.steps}>
          {[
            'Read the question and compare it to the plant in front of you.',
            'Tap A or B - whichever description fits best.',
            'Repeat until the key gives you a likely match or a short candidate list.',
            'Use Back any time if you think you took a wrong turn.',
          ].map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.stepBadge, { backgroundColor: palette.primary }]}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: palette.textMuted }]}>{step}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.tip,
            {
              backgroundColor: isDark ? palette.surfaceMuted : '#EEF5EE',
            },
          ]}
        >
          <Text style={[styles.tipLabel, { color: palette.text }]}>Need a refresher on plant terms?</Text>
          <Text style={[styles.tipBody, { color: palette.textMuted }]}>
            Open the field glossary any time for quick definitions and simple diagrams of leaf arrangement, composite flowers, square stems, and more.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [
            styles.startButton,
            {
              backgroundColor: palette.primary,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.startButtonText}>Start identifying</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onOpenGlossary}
          style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
        >
          <Text style={[styles.linkButtonText, { color: palette.primary }]}>Browse the field glossary first</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    padding: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    marginTop: -4,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  stepBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  tip: {
    borderRadius: 12,
    gap: 6,
    padding: 14,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  startButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
