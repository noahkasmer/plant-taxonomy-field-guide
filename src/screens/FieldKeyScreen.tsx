import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { GlossarySheet } from '@/components/GlossarySheet';
import { GuidedFieldMode } from '@/components/GuidedFieldMode';
import { keyNodes, ROOT_NODE_ID } from '@/data/dichotomousKey';
import { useAppStore } from '@/store/appStore';
import { getBundledPlantImageSource } from '@/utils/imageAssets';
import { findSubKeyEntry } from '@/utils/keyTraversal';
import type { KeyNode } from '@/types/dichotomousKey';

const DARK_BG = '#0D1F15';
const ACCENT = '#7DD4A0';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#5E8F70';
const CARD_BG = '#1A4A2E';
const SEED_BANNER_BG = '#153D24';

function findNode(id: string): KeyNode | null {
  return keyNodes.find((node) => node.id === id) ?? null;
}

type Props = {
  seedPlantIds?: string[];
};

export function FieldKeyScreen({ seedPlantIds }: Props) {
  const router = useRouter();
  const plantSummaries = useAppStore((state) => state.plantSummaries);
  const favoriteIds = useAppStore((state) => state.favoriteIds);

  const startNodeId = useMemo(
    () => (seedPlantIds && seedPlantIds.length > 0 ? findSubKeyEntry(seedPlantIds) : ROOT_NODE_ID),
    [seedPlantIds],
  );

  const [currentNodeId, setCurrentNodeId] = useState<string>(startNodeId);
  const [history, setHistory] = useState<{ nodeId: string; choice: 'a' | 'b' }[]>([]);
  const [resultIds, setResultIds] = useState<string[] | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const currentNode = resultIds ? null : findNode(currentNodeId);

  function handleChoice(choice: 'a' | 'b') {
    if (!currentNode) return;
    const next = currentNode[choice].next;
    if (Array.isArray(next)) {
      setHistory((h) => [...h, { nodeId: currentNodeId, choice }]);
      setResultIds(next);
    } else {
      setHistory((h) => [...h, { nodeId: currentNodeId, choice }]);
      setCurrentNodeId(next);
    }
  }

  function handleBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setResultIds(null);
    setCurrentNodeId(prev.nodeId);
  }

  function handleRestart() {
    setHistory([]);
    setResultIds(null);
    setCurrentNodeId(startNodeId);
  }

  const matchingPlants = useMemo(() => {
    if (!resultIds) return [];
    const candidates = plantSummaries.filter((p) => resultIds.includes(p.id));
    if (seedPlantIds && seedPlantIds.length > 0) {
      return candidates.filter((p) => seedPlantIds.includes(p.id));
    }
    return candidates;
  }, [resultIds, plantSummaries, seedPlantIds]);

  const isSeeded = seedPlantIds && seedPlantIds.length > 0;

  if (resultIds !== null) {
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.container}>
        <GlossarySheet visible={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={handleBack}
            style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
          >
            <Text style={styles.accentText}>Back</Text>
          </Pressable>
          <Text style={styles.stepText}>RESULTS</Text>
          <View style={styles.topBarActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/field-browse')}
              style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
            >
              <Text style={styles.accentText}>Traits</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setGlossaryOpen(true)}
              style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
            >
              <Text style={styles.accentText}>?</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.topBarButton, pressed && styles.pressed]}
            >
              <Text style={styles.accentText}>Exit</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsContent}>
          <Text style={styles.resultsHeading}>
            {matchingPlants.length === 1
              ? '1 likely match'
              : `${matchingPlants.length} likely matches`}
          </Text>
          <Text style={styles.resultsSub}>Tap a plant for full details and photos.</Text>

          {matchingPlants.map((plant) => {
            const imgSource = plant.heroImage ? getBundledPlantImageSource(plant.heroImage) : null;
            const isFav = favoriteIds.includes(plant.id);
            return (
              <Pressable
                key={plant.id}
                accessibilityRole="button"
                onPress={() => router.push(`/plants/${plant.id}`)}
                style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}
              >
                {imgSource ? (
                  <Image
                    source={imgSource}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={styles.resultImage}
                  />
                ) : (
                  <View style={styles.resultImagePlaceholder}>
                    <Text style={styles.resultImagePlaceholderText}>No photo</Text>
                  </View>
                )}
                <View style={styles.resultCardBody}>
                  <Text style={styles.resultCommonName}>{plant.commonName}</Text>
                  <Text style={styles.resultSciName}>{plant.scientificName}</Text>
                  {isFav ? <Text style={styles.favBadge}>Saved</Text> : null}
                </View>
              </Pressable>
            );
          })}

          <Pressable
            accessibilityRole="button"
            onPress={handleRestart}
            style={({ pressed }) => [styles.restartButton, pressed && styles.pressed]}
          >
            <Text style={styles.restartText}>Start key over</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <>
      <GlossarySheet visible={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <GuidedFieldMode
        currentNode={currentNode}
        stepNumber={history.length + 1}
        historyLength={history.length}
        seedBanner={isSeeded ? `Narrowing ${seedPlantIds!.length} candidates` : undefined}
        onChoice={handleChoice}
        onBack={handleBack}
        onRestart={handleRestart}
        onBrowseByTrait={() => router.push('/field-browse')}
        onOpenGlossary={() => setGlossaryOpen(true)}
        onExitFieldMode={() => router.back()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_BG,
    flex: 1,
    paddingHorizontal: 22,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  accentText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: '600',
  },
  stepText: {
    color: TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  pressed: {
    opacity: 0.68,
  },
  resultsContent: {
    paddingBottom: 48,
  },
  resultsHeading: {
    color: TEXT_PRIMARY,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultsSub: {
    color: TEXT_MUTED,
    fontSize: 15,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  resultImage: {
    height: 180,
    width: '100%',
  },
  resultImagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#153D24',
    height: 120,
    justifyContent: 'center',
    width: '100%',
  },
  resultImagePlaceholderText: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '600',
  },
  resultCardBody: {
    gap: 4,
    padding: 16,
  },
  resultCommonName: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '700',
  },
  resultSciName: {
    color: TEXT_MUTED,
    fontSize: 15,
    fontStyle: 'italic',
  },
  favBadge: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  restartButton: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 14,
  },
  restartText: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
  seedBanner: {
    backgroundColor: SEED_BANNER_BG,
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  seedBannerText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
