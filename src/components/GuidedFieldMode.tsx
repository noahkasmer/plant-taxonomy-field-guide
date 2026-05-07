import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LeafDiagram } from '@/components/LeafDiagram';
import type { KeyNode } from '@/types/dichotomousKey';

type GuidedFieldModeProps = {
  currentNode: KeyNode | null;
  stepNumber: number;
  historyLength: number;
  onChoice: (choice: 'a' | 'b') => void;
  onBack: () => void;
  onRestart: () => void;
  onBrowseByTrait: () => void;
  onOpenGlossary: () => void;
  onExitFieldMode: () => void;
};

const DARK_BACKGROUND = '#0D1F15';
const CHOICE_A = '#1A4A2E';
const CHOICE_B = '#153D24';
const ACCENT = '#7DD4A0';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_BODY = '#E8F2EA';
const TEXT_MUTED = '#5E8F70';
const CONTEXT_BG = '#111C16';

export function GuidedFieldMode({
  currentNode,
  stepNumber,
  historyLength,
  onChoice,
  onBack,
  onRestart,
  onBrowseByTrait,
  onOpenGlossary,
  onExitFieldMode,
}: GuidedFieldModeProps) {
  if (!currentNode) {
    return null;
  }

  const canGoBack = historyLength > 0;

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back one step"
          onPress={onBack}
          style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
        >
          <Text style={[styles.backText, !canGoBack && styles.invisible]}>Back</Text>
        </Pressable>

        <Text style={styles.stepText}>STEP {stepNumber}</Text>

        <View style={styles.topBarActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Browse plants by trait"
            onPress={onBrowseByTrait}
            style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
          >
            <Text style={styles.exitText}>Traits</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open field glossary"
            onPress={onOpenGlossary}
            style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
          >
            <Text style={styles.exitText}>?</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Exit field mode"
            onPress={onExitFieldMode}
            style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
          >
            <Text style={styles.exitText}>Exit</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionArea}>
          <Text style={styles.questionText}>{currentNode.question}</Text>
          {currentNode.context ? (
            <View style={styles.contextBox}>
              <Text style={styles.contextText}>{currentNode.context}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.choicesArea}>
          {(['a', 'b'] as const).map((side) => {
            const choice = currentNode[side];
            return (
              <Pressable
                key={side}
                accessibilityRole="button"
                onPress={() => onChoice(side)}
                style={({ pressed }) => [
                  styles.choiceButton,
                  side === 'a' ? styles.choiceA : styles.choiceB,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.choiceLetter}>{side.toUpperCase()}</Text>
                <View style={styles.choiceContent}>
                  <Text style={styles.choiceText}>{choice.label}</Text>
                  {choice.hint ? (
                    <Text style={styles.choiceHint}>{choice.hint}</Text>
                  ) : null}
                </View>
                {choice.diagram ? (
                  <View style={styles.diagramWrapper}>
                    <LeafDiagram type={choice.diagram} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {canGoBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRestart}
            style={({ pressed }) => [styles.restartButton, pressed && styles.pressed]}
          >
            <Text style={styles.restartText}>Restart key</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BACKGROUND,
    paddingHorizontal: 22,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBarButton: {
    minWidth: 70,
    paddingVertical: 10,
  },
  topBarActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  questionArea: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  questionText: {
    color: TEXT_PRIMARY,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  contextBox: {
    backgroundColor: CONTEXT_BG,
    borderRadius: 12,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contextText: {
    color: TEXT_MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  choicesArea: {
    gap: 14,
  },
  choiceButton: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  choiceA: {
    backgroundColor: CHOICE_A,
  },
  choiceB: {
    backgroundColor: CHOICE_B,
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
  choiceContent: {
    flex: 1,
    gap: 6,
  },
  choiceText: {
    color: TEXT_BODY,
    fontSize: 17,
    lineHeight: 25,
  },
  choiceHint: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  diagramWrapper: {
    opacity: 0.85,
  },
  restartButton: {
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
