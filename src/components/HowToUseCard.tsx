import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onStart: () => void;
  onOpenGlossary: () => void;
};

export function HowToUseCard({ onStart, onOpenGlossary }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>How to use this key</Text>
        <Text style={styles.title}>Identify a Plant</Text>
        <Text style={styles.body}>
          This is a{' '}
          <Text style={styles.bold}>dichotomous key</Text>
          {' '}— a classic field guide tool that narrows down a plant one question at a time.
        </Text>

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepText}>
              Read the question and look closely at the plant in front of you.
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepText}>
              Tap{' '}<Text style={styles.bold}>A</Text>{' '}or{' '}<Text style={styles.bold}>B</Text>{' '}— whichever description matches what you observe.
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepText}>
              Repeat until the key gives you a result. Most paths take 4–7 steps.
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>4</Text></View>
            <Text style={styles.stepText}>
              Made a wrong turn? Tap{' '}<Text style={styles.bold}>Back</Text>{' '}at any step.
            </Text>
          </View>
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipLabel}>Not sure what a term means?</Text>
          <Text style={styles.tipBody}>
            Tap the{' '}
            <Text style={styles.bold}>?</Text>
            {' '}button in the top corner at any point to open the Field Glossary, which explains every botanical term with diagrams.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
        >
          <Text style={styles.startBtnText}>Start identifying</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onOpenGlossary}
          style={({ pressed }) => [styles.glossaryBtn, pressed && styles.pressed]}
        >
          <Text style={styles.glossaryBtnText}>Browse the Field Glossary first</Text>
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
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    padding: 22,
  },
  eyebrow: {
    color: '#5E6F60',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1F3D2F',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    marginTop: -4,
  },
  body: {
    color: '#4A5B4D',
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    color: '#1F3D2F',
    fontWeight: '700',
  },
  steps: {
    gap: 12,
  },
  step: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: '#2F6847',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    color: '#4A5B4D',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  tip: {
    backgroundColor: '#EEF5EE',
    borderRadius: 12,
    gap: 6,
    padding: 14,
  },
  tipLabel: {
    color: '#1F3D2F',
    fontSize: 14,
    fontWeight: '700',
  },
  tipBody: {
    color: '#4A5B4D',
    fontSize: 14,
    lineHeight: 21,
  },
  startBtn: {
    alignItems: 'center',
    backgroundColor: '#2F6847',
    borderRadius: 14,
    paddingVertical: 16,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  glossaryBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  glossaryBtnText: {
    color: '#2F6847',
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
