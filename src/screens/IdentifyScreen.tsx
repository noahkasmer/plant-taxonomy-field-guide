import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfirmationBanner } from '@/components/ConfirmationBanner';
import { GlossarySheet } from '@/components/GlossarySheet';
import { HowToUseCard } from '@/components/HowToUseCard';
import { FieldModeScreen } from '@/screens/FieldModeScreen';
import { ROOT_NODE_ID, keyNodes } from '@/data/dichotomousKey';
import type { IdentificationResult, KeyNode, KeyPathStep } from '@/types/dichotomousKey';
import { getPlantById } from '@/utils/plants';

const nodeMap = new Map<string, KeyNode>(keyNodes.map((n) => [n.id, n]));

// Soft upper bound used only for the progress bar fill — not botanically exact.
const ESTIMATED_MAX_STEPS = 8;

function isTerminal(next: string | string[]): next is string[] {
  return Array.isArray(next);
}

export function IdentifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [introduced, setIntroduced] = useState(false);
  const [glossaryVisible, setGlossaryVisible] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(ROOT_NODE_ID);
  const [history, setHistory] = useState<KeyPathStep[]>([]);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [fieldMode, setFieldMode] = useState(false);

  const currentNode = nodeMap.get(currentNodeId) ?? null;
  const stepNumber = history.length + 1;

  function handleChoice(choice: 'a' | 'b') {
    if (!currentNode) return;
    const next = choice === 'a' ? currentNode.a.next : currentNode.b.next;
    const step: KeyPathStep = { nodeId: currentNodeId, choice };
    if (isTerminal(next)) {
      setResult({ plantIds: next, keyPath: [...history, step] });
    } else {
      setHistory((prev) => [...prev, step]);
      setCurrentNodeId(next);
    }
  }

  function handleBack() {
    if (result) { setResult(null); return; }
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentNodeId(prev.nodeId);
  }

  function handleRestart() {
    setCurrentNodeId(ROOT_NODE_ID);
    setHistory([]);
    setResult(null);
  }

  // ── Intro card (shown once before key begins) ───────────────────────────────
  if (!introduced) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <Stack.Screen options={{ title: 'Identify' }} />
        <GlossarySheet visible={glossaryVisible} onClose={() => setGlossaryVisible(false)} />
        <HowToUseCard
          onStart={() => setIntroduced(true)}
          onOpenGlossary={() => setGlossaryVisible(true)}
        />
      </View>
    );
  }

  // Field mode: delegate rendering to FieldModeScreen, share all state
  if (fieldMode && !result) {
    return (
      <FieldModeScreen
        currentNode={currentNode}
        stepNumber={stepNumber}
        historyLength={history.length}
        onChoice={handleChoice}
        onBack={handleBack}
        onRestart={handleRestart}
        onExitFieldMode={() => setFieldMode(false)}
      />
    );
  }

  // ── Result screen ───────────────────────────────────────────────────────────
  if (result) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <Stack.Screen options={{ title: 'Result' }} />

        <View style={styles.resultHeaderRow}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>
              {result.plantIds.length === 1 ? 'Match found' : 'Possible matches'}
            </Text>
          </View>
          <Text style={styles.stepsTakenText}>{result.keyPath.length} steps</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.resultScroll}
          showsVerticalScrollIndicator={false}
        >
          <ConfirmationBanner result={result} />

          {result.plantIds.map((id) => {
            const plant = getPlantById(id);
            if (!plant) return null;
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                onPress={() => router.push(`/plants/${plant.id}`)}
                style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}
              >
                <Text style={styles.resultPlantName}>{plant.commonName}</Text>
                <Text style={styles.resultScientific}>{plant.scientificName}</Text>
                <Text style={styles.resultFamily}>{plant.family}</Text>
                <View style={styles.featureList}>
                  {plant.identifyingFeatures.slice(0, 3).map((f) => (
                    <Text key={f} style={styles.featureItem}>• {f}</Text>
                  ))}
                </View>
                <Text style={styles.resultCta}>View full record →</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.resultActions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleBack}
            style={({ pressed }) => [styles.actionBtn, styles.actionSecondary, pressed && styles.pressed]}
          >
            <Text style={styles.actionSecondaryText}>← Undo last</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleRestart}
            style={({ pressed }) => [styles.actionBtn, styles.actionPrimary, pressed && styles.pressed]}
          >
            <Text style={styles.actionPrimaryText}>Start over</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Key step screen ─────────────────────────────────────────────────────────
  if (!currentNode) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Key node "{currentNodeId}" not found.</Text>
      </View>
    );
  }

  // Progress: fill grows each step, never reaches 100% before terminal
  const progressPct = Math.min(stepNumber / ESTIMATED_MAX_STEPS, 0.88);
  const canGoBack = history.length > 0;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <Stack.Screen options={{ title: 'Identify' }} />
      <GlossarySheet visible={glossaryVisible} onClose={() => setGlossaryVisible(false)} />

      {/* ── Header row ── */}
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back one step"
          onPress={handleBack}
          style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
        >
          <Text style={[styles.headerBtnText, !canGoBack && styles.invisible]}>← Back</Text>
        </Pressable>

        <Text style={styles.stepLabel}>Step {stepNumber}</Text>

        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open field glossary"
            onPress={() => setGlossaryVisible(true)}
            style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.glossaryBtnText}>?</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Switch to field mode"
            onPress={() => setFieldMode(true)}
            style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.fieldModeText}>Field</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: progressPct }]} />
        <View style={{ flex: 1 - progressPct }} />
      </View>

      {/* ── Question ── */}
      <View style={styles.questionArea}>
        <Text style={styles.questionText}>{currentNode.question}</Text>
      </View>

      {/* ── Choices ── */}
      <View style={styles.choicesArea}>
        <Pressable
          accessibilityRole="button"
          onPress={() => handleChoice('a')}
          style={({ pressed }) => [styles.choiceBtn, styles.choiceA, pressed && styles.pressed]}
        >
          <Text style={styles.choiceLetter}>A</Text>
          <Text style={styles.choiceText}>{currentNode.a.label}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => handleChoice('b')}
          style={({ pressed }) => [styles.choiceBtn, styles.choiceB, pressed && styles.pressed]}
        >
          <Text style={styles.choiceLetter}>B</Text>
          <Text style={styles.choiceText}>{currentNode.b.label}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0E8',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // Header
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBtn: {
    minWidth: 80,
    paddingVertical: 8,
  },
  headerBtnText: {
    color: '#2F6847',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  glossaryBtnText: {
    color: '#2F6847',
    fontSize: 19,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  fieldModeText: {
    color: '#2F6847',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    color: '#1F3D2F',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  invisible: {
    opacity: 0,
  },

  // Progress
  progressTrack: {
    backgroundColor: '#D7DED0',
    borderRadius: 2,
    flexDirection: 'row',
    height: 3,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#2F6847',
  },

  // Question
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  questionText: {
    color: '#1F3D2F',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },

  // Choices
  choicesArea: {
    gap: 12,
  },
  choiceBtn: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    minHeight: 82,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  choiceA: {
    backgroundColor: '#E2EDE0',
    borderColor: '#B5C9B8',
  },
  choiceB: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
  },
  choiceLetter: {
    color: '#2F6847',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    minWidth: 22,
  },
  choiceText: {
    color: '#1F3D2F',
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
  },

  // Shared press state
  pressed: {
    opacity: 0.75,
  },

  // Result
  resultHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  matchBadge: {
    backgroundColor: '#2F6847',
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
    color: '#5E6F60',
    fontSize: 14,
  },
  resultScroll: {
    gap: 14,
    paddingBottom: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 20,
  },
  resultPlantName: {
    color: '#1F3D2F',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  resultScientific: {
    color: '#4A5B4D',
    fontSize: 17,
    fontStyle: 'italic',
  },
  resultFamily: {
    color: '#5E6F60',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featureList: {
    gap: 5,
    marginTop: 8,
  },
  featureItem: {
    color: '#3A4E3C',
    fontSize: 15,
    lineHeight: 22,
  },
  resultCta: {
    color: '#2F6847',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  actionBtn: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    paddingVertical: 16,
  },
  actionPrimary: {
    backgroundColor: '#2F6847',
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  actionSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderWidth: 1,
  },
  actionSecondaryText: {
    color: '#1F3D2F',
    fontSize: 16,
    fontWeight: '600',
  },

  errorText: {
    color: '#4A5B4D',
    fontSize: 16,
    padding: 20,
  },
});
