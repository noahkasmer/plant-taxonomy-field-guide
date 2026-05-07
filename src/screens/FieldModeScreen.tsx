// High-contrast, minimum-clutter rendering for outdoor field use.
// All state lives in IdentifyScreen — this component only handles presentation.

import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { KeyNode } from '@/types/dichotomousKey';

type Props = {
  currentNode: KeyNode | null;
  stepNumber: number;
  historyLength: number;
  onChoice: (choice: 'a' | 'b') => void;
  onBack: () => void;
  onRestart: () => void;
  onExitFieldMode: () => void;
};

export function FieldModeScreen({
  currentNode,
  stepNumber,
  historyLength,
  onChoice,
  onBack,
  onRestart,
  onExitFieldMode,
}: Props) {
  const insets = useSafeAreaInsets();

  if (!currentNode) return null;

  const canGoBack = historyLength > 0;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
    >
      {/* Hide the default Stack header — field mode owns its full screen */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back one step"
          onPress={onBack}
          style={({ pressed }) => [styles.topBarBtn, pressed && styles.pressed]}
        >
          <Text style={[styles.backText, !canGoBack && styles.invisible]}>← Back</Text>
        </Pressable>

        <Text style={styles.stepText}>STEP {stepNumber}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Exit field mode"
          onPress={onExitFieldMode}
          style={({ pressed }) => [styles.topBarBtn, pressed && styles.pressed]}
        >
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
      </View>

      {/* ── Question ── */}
      <View style={styles.questionArea}>
        <Text style={styles.questionText}>{currentNode.question}</Text>
      </View>

      {/* ── Choices ── */}
      <View style={styles.choicesArea}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChoice('a')}
          style={({ pressed }) => [styles.choiceBtn, styles.choiceA, pressed && styles.pressed]}
        >
          <Text style={styles.choiceLetter}>A</Text>
          <Text style={styles.choiceText}>{currentNode.a.label}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => onChoice('b')}
          style={({ pressed }) => [styles.choiceBtn, styles.choiceB, pressed && styles.pressed]}
        >
          <Text style={styles.choiceLetter}>B</Text>
          <Text style={styles.choiceText}>{currentNode.b.label}</Text>
        </Pressable>
      </View>

      {/* ── Restart (only after first step) ── */}
      {canGoBack ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRestart}
          style={({ pressed }) => [styles.restartBtn, pressed && styles.pressed]}
        >
          <Text style={styles.restartText}>Restart key</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const DARK_BG = '#0D1F15';
const CHOICE_A_BG = '#1A4A2E';
const CHOICE_B_BG = '#153D24';
const ACCENT = '#7DD4A0';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_BODY = '#E8F2EA';
const TEXT_MUTED = '#5E8F70';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingHorizontal: 22,
  },

  // Top bar
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  topBarBtn: {
    minWidth: 70,
    paddingVertical: 10,
  },
  backText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: '600',
  },
  exitText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
  },
  stepText: {
    color: TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  invisible: {
    opacity: 0,
  },

  // Question
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  questionText: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },

  // Choices — extra tall for gloved or one-handed use
  choicesArea: {
    gap: 14,
  },
  choiceBtn: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 18,
    minHeight: 96,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  choiceA: {
    backgroundColor: CHOICE_A_BG,
  },
  choiceB: {
    backgroundColor: CHOICE_B_BG,
    borderColor: '#2D6844',
    borderWidth: 1,
  },
  choiceLetter: {
    color: ACCENT,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    minWidth: 28,
  },
  choiceText: {
    color: TEXT_BODY,
    flex: 1,
    fontSize: 17,
    lineHeight: 25,
  },

  // Restart
  restartBtn: {
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 12,
  },
  restartText: {
    color: TEXT_MUTED,
    fontSize: 15,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.68,
  },
});
