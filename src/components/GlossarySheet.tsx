import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { LeafDiagram } from '@/components/LeafDiagram';
import type { DiagramType } from '@/components/LeafDiagram';

type GlossaryTerm = {
  term: string;
  definition: string;
  diagram?: DiagramType;
};

type GlossarySection = {
  title: string;
  terms: GlossaryTerm[];
};

const sections: GlossarySection[] = [
  {
    title: 'Leaf Arrangement',
    terms: [
      {
        term: 'Opposite',
        definition:
          'Two leaves grow directly across from each other at the same node on the stem.',
        diagram: 'opposite',
      },
      {
        term: 'Alternate',
        definition: 'Leaves grow one at a time, staggered on opposite sides of the stem.',
        diagram: 'alternate',
      },
      {
        term: 'Basal',
        definition:
          'Leaves grow from the base of the plant, close to the ground. The stem itself is mostly leafless.',
        diagram: 'basal',
      },
      {
        term: 'Rosette',
        definition:
          'Leaves form a circular cluster at ground level, like a rose viewed from above.',
        diagram: 'basal',
      },
      {
        term: 'Whorled',
        definition:
          'Three or more leaves grow from the same point on the stem, radiating outward.',
        diagram: 'whorled',
      },
    ],
  },
  {
    title: 'Leaf Form',
    terms: [
      {
        term: 'Simple leaf',
        definition: 'A single undivided leaf blade - one leaf per stem attachment point.',
        diagram: 'simple',
      },
      {
        term: 'Compound leaf',
        definition:
          'A leaf divided into several distinct leaflets on one stalk. The whole structure still counts as one leaf.',
        diagram: 'compound',
      },
      {
        term: 'Palmate',
        definition:
          'Leaflets or lobes fan out from a central point, like fingers from a hand.',
      },
      {
        term: 'Lobed',
        definition:
          'A leaf with deep indentations that do not cut all the way through to the midrib.',
      },
    ],
  },
  {
    title: 'Leaf Shape',
    terms: [
      {
        term: 'Lanceolate',
        definition:
          'Longer than wide and tapering toward the tip, like a lance head.',
      },
      {
        term: 'Ovate',
        definition: 'Egg-shaped, widest near the base and tapering toward the tip.',
      },
      {
        term: 'Linear',
        definition: 'Very narrow with nearly parallel sides, like a grass blade.',
      },
      {
        term: 'Cordate',
        definition: 'Heart-shaped, with a notch at the base where it meets the stem.',
      },
    ],
  },
  {
    title: 'Leaf Edge',
    terms: [
      {
        term: 'Entire',
        definition: 'Smooth edge with no teeth, notches, or lobes.',
      },
      {
        term: 'Serrate',
        definition: 'Edge with sharp teeth that point toward the tip, like a saw blade.',
      },
      {
        term: 'Toothed',
        definition: 'Edge with more irregular or broader teeth than a strongly serrate leaf.',
      },
      {
        term: 'Crenate',
        definition: 'Edge with rounded, scalloped teeth.',
      },
    ],
  },
  {
    title: 'Stem Terms',
    terms: [
      {
        term: 'Node',
        definition:
          'The point on a stem where a leaf, branch, or bud attaches. You can often feel a slight swelling there.',
      },
      {
        term: 'Square stem',
        definition:
          'A stem with four flattened sides so it feels distinctly square when rolled between your fingers.',
        diagram: 'square-stem',
      },
      {
        term: 'Clasping',
        definition:
          'A leaf base that wraps partway around the stem instead of attaching on a separate stalk.',
        diagram: 'clasping',
      },
      {
        term: 'Erect',
        definition: 'Growing upright and mostly straight.',
      },
      {
        term: 'Branching',
        definition: 'Stem divides into noticeable side branches above the base.',
      },
    ],
  },
  {
    title: 'Flower Terms',
    terms: [
      {
        term: 'Composite flower',
        definition:
          'A flower head made of many tiny individual florets packed together. Daisy and aster relatives use this structure.',
        diagram: 'ray-disk',
      },
      {
        term: 'Ray',
        definition:
          'The strap-shaped outer petals of a composite flower, like the yellow rays on a Black-Eyed Susan.',
      },
      {
        term: 'Disk',
        definition:
          'The central button-like cluster of florets in a composite flower head.',
      },
      {
        term: 'Spike',
        definition:
          'Flowers arranged along a long central stem without separate little flower stalks.',
      },
      {
        term: 'Tubular',
        definition:
          'Flower petals are fused into a tube or funnel rather than lying flat.',
      },
    ],
  },
  {
    title: 'Habitats',
    terms: [
      {
        term: 'Prairie',
        definition:
          'Open grassland dominated by native grasses and wildflowers, with few or no trees.',
      },
      {
        term: 'Savanna',
        definition:
          'Open grassland with scattered trees, usually bright enough for a strong wildflower layer.',
      },
      {
        term: 'Woodland',
        definition: 'Lightly shaded ground under a partial tree canopy.',
      },
      {
        term: 'Floodplain',
        definition:
          'Low ground near rivers or streams that floods periodically and supports moisture-loving plants.',
      },
      {
        term: 'Fen',
        definition:
          'A wetland fed by mineral-rich groundwater, often supporting distinctive plant communities.',
      },
    ],
  },
];

type GlossarySheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function GlossarySheet({ visible, onClose }: GlossarySheetProps) {
  const { palette, isDark } = useAppTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.sheet, { backgroundColor: palette.background }]}>
        <View
          style={[
            styles.sheetHeader,
            {
              backgroundColor: palette.background,
              borderBottomColor: palette.border,
            },
          ]}
        >
          <Text style={[styles.sheetTitle, { color: palette.text }]}>Field Glossary</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close glossary"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={[styles.closeButtonText, { color: palette.primary }]}>Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {sections.map((section) => (
            <View
              key={section.title}
              style={[
                styles.section,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    backgroundColor: palette.surfaceAccent,
                    color: palette.text,
                  },
                ]}
              >
                {section.title}
              </Text>
              {section.terms.map((entry) => (
                <View
                  key={entry.term}
                  style={[
                    styles.termRow,
                    {
                      borderTopColor: isDark ? palette.border : '#EEF2EB',
                    },
                  ]}
                >
                  {entry.diagram ? (
                    <View style={styles.termWithDiagram}>
                      <View style={styles.termTextBlock}>
                        <Text style={[styles.termName, { color: palette.text }]}>{entry.term}</Text>
                        <Text style={[styles.termDefinition, { color: palette.textMuted }]}>
                          {entry.definition}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.diagramWrapper,
                          {
                            backgroundColor: isDark ? palette.surfaceMuted : '#EEF5EE',
                          },
                        ]}
                      >
                        <LeafDiagram type={entry.diagram} />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={[styles.termName, { color: palette.text }]}>{entry.term}</Text>
                      <Text style={[styles.termDefinition, { color: palette.textMuted }]}>
                        {entry.definition}
                      </Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
  },
  sheetHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  closeButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollContent: {
    gap: 20,
    padding: 20,
    paddingBottom: 48,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  termRow: {
    borderTopWidth: 1,
    gap: 4,
    padding: 16,
  },
  termWithDiagram: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  termTextBlock: {
    flex: 1,
    gap: 4,
  },
  diagramWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
  },
  termName: {
    fontSize: 16,
    fontWeight: '700',
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.7,
  },
});
