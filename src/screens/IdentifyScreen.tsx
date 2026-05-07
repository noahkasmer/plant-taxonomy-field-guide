import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { GlossarySheet } from '@/components/GlossarySheet';
import { GuidedFieldMode } from '@/components/GuidedFieldMode';
import { HowToUseCard } from '@/components/HowToUseCard';
import { PlantCard } from '@/components/PlantCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { ROOT_NODE_ID, keyNodes } from '@/data/dichotomousKey';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppStore } from '@/store/appStore';
import type { IdentificationResult, KeyNode, KeyPathStep } from '@/types/dichotomousKey';

const estimatedMaxSteps = 8;
const nodeMap = new Map<string, KeyNode>(keyNodes.map((node) => [node.id, node]));

function isTerminal(next: string | string[]): next is string[] {
  return Array.isArray(next);
}

export function IdentifyScreen() {
  const router = useRouter();
  const { palette, isDark } = useAppTheme();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const [introduced, setIntroduced] = useState(false);
  const [glossaryVisible, setGlossaryVisible] = useState(false);
  const [fieldMode, setFieldMode] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(ROOT_NODE_ID);
  const [history, setHistory] = useState<KeyPathStep[]>([]);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  const summaryById = useMemo(
    () => Object.fromEntries(plantSummaries.map((plant) => [plant.id, plant])),
    [plantSummaries],
  );
  const currentNode = nodeMap.get(currentNodeId) ?? null;
  const stepNumber = history.length + 1;
  const progressFraction = Math.min(stepNumber / estimatedMaxSteps, 0.88);
  const canGoBack = history.length > 0;

  function handleChoice(choice: 'a' | 'b') {
    if (!currentNode) {
      return;
    }

    const next = choice === 'a' ? currentNode.a.next : currentNode.b.next;
    const step: KeyPathStep = { nodeId: currentNodeId, choice };

    if (isTerminal(next)) {
      setResult({ plantIds: next, keyPath: [...history, step] });
      return;
    }

    setHistory((previous) => [...previous, step]);
    setCurrentNodeId(next);
  }

  function handleBack() {
    if (result) {
      setResult(null);
      return;
    }

    if (!canGoBack) {
      return;
    }

    const previousStep = history[history.length - 1];
    setHistory((previous) => previous.slice(0, -1));
    setCurrentNodeId(previousStep.nodeId);
  }

  function handleRestart() {
    setCurrentNodeId(ROOT_NODE_ID);
    setHistory([]);
    setResult(null);
    setFieldMode(false);
  }

  const resultPlants = result?.plantIds
    .map((id) => summaryById[id])
    .filter((plant): plant is NonNullable<typeof plant> => Boolean(plant)) ?? [];

  if (fieldMode && !result) {
    return (
      <>
        <Stack.Screen options={{ title: 'Start Identification', headerShown: false }} />
        <GlossarySheet visible={glossaryVisible} onClose={() => setGlossaryVisible(false)} />
        <GuidedFieldMode
          currentNode={currentNode}
          stepNumber={stepNumber}
          historyLength={history.length}
          onChoice={handleChoice}
          onBack={handleBack}
          onRestart={handleRestart}
          onBrowseByTrait={() => router.push('/field-browse')}
          onOpenGlossary={() => setGlossaryVisible(true)}
          onExitFieldMode={() => setFieldMode(false)}
        />
      </>
    );
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Start Identification', headerShown: true }} />
      <GlossarySheet visible={glossaryVisible} onClose={() => setGlossaryVisible(false)} />

      {!introduced ? (
        <HowToUseCard
          onStart={() => setIntroduced(true)}
          onOpenGlossary={() => setGlossaryVisible(true)}
        />
      ) : result ? (
        <View style={styles.flex}>
          <View style={styles.resultHeaderRow}>
            <View
              style={[
                styles.matchBadge,
                {
                  backgroundColor: palette.primary,
                },
              ]}
            >
              <Text style={styles.matchBadgeText}>
                {resultPlants.length === 1 ? 'Match found' : 'Possible matches'}
              </Text>
            </View>
            <Text style={[styles.stepsTakenText, { color: palette.textSubtle }]}>
              {result.keyPath.length} steps
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
            <SectionHeading
              title="Guided results"
              subtitle="Use the detail pages to confirm leaf shape, habitat, and image matches."
            />
            {resultPlants.map((plant) => (
              <View key={plant.id} style={styles.resultCardWrap}>
                <PlantCard
                  plant={plant}
                  favorite={favoriteIds.includes(plant.id)}
                  onPress={() => router.push(`/plants/${plant.id}`)}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.resultActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleBack}
              style={({ pressed }) => [
                styles.actionButton,
                styles.secondaryActionButton,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.secondaryActionText, { color: palette.text }]}>Undo last</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleRestart}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: palette.primary,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryActionText}>Start over</Text>
            </Pressable>
          </View>
        </View>
      ) : !currentNode ? (
        <View style={styles.flex}>
          <Text style={[styles.errorText, { color: palette.textMuted }]}>
            The guided key could not find the next question.
          </Text>
        </View>
      ) : (
        <View style={styles.flex}>
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back one step"
              onPress={handleBack}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  { color: palette.primary },
                  !canGoBack && styles.invisible,
                ]}
              >
                Back
              </Text>
            </Pressable>

            <Text style={[styles.stepLabel, { color: palette.text }]}>Step {stepNumber}</Text>

            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open field glossary"
                onPress={() => setGlossaryVisible(true)}
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
              >
                <Text style={[styles.headerButtonText, { color: palette.primary }]}>?</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Switch to high-contrast field mode"
                onPress={() => setFieldMode(true)}
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
              >
                <Text style={[styles.headerButtonText, { color: palette.primary }]}>Field</Text>
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: palette.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: palette.primary,
                  flex: progressFraction,
                },
              ]}
            />
            <View style={{ flex: 1 - progressFraction }} />
          </View>

          <View style={styles.questionArea}>
            <Text style={[styles.questionText, { color: palette.text }]}>{currentNode.question}</Text>
            <Text style={[styles.questionHelp, { color: palette.textSubtle }]}>
              Pick the option that fits best. If you are unsure, use the glossary or back up and try the other branch.
            </Text>
          </View>

          <View style={styles.choicesArea}>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleChoice('a')}
              style={({ pressed }) => [
                styles.choiceButton,
                {
                  backgroundColor: isDark ? palette.surfaceMuted : palette.surfaceAccent,
                  borderColor: palette.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.choiceLetter, { color: palette.primary }]}>A</Text>
              <Text style={[styles.choiceText, { color: palette.text }]}>{currentNode.a.label}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => handleChoice('b')}
              style={({ pressed }) => [
                styles.choiceButton,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.choiceLetter, { color: palette.primary }]}>B</Text>
              <Text style={[styles.choiceText, { color: palette.text }]}>{currentNode.b.label}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerButton: {
    minWidth: 72,
    paddingVertical: 8,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  invisible: {
    opacity: 0,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressTrack: {
    borderRadius: 2,
    flexDirection: 'row',
    height: 3,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 2,
  },
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  questionText: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  questionHelp: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  choicesArea: {
    gap: 12,
  },
  choiceButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    minHeight: 82,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  choiceLetter: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    minWidth: 22,
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
  },
  pressed: {
    opacity: 0.8,
  },
  resultHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  matchBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  matchBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepsTakenText: {
    fontSize: 14,
  },
  resultScroll: {
    gap: 14,
    paddingBottom: 8,
  },
  resultCardWrap: {
    marginBottom: 14,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    paddingVertical: 16,
  },
  secondaryActionButton: {
    borderWidth: 1,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    padding: 20,
  },
});
