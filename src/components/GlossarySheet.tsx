import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
        definition: 'Two leaves grow directly across from each other at the same point (node) on the stem.',
        diagram: 'opposite',
      },
      {
        term: 'Alternate',
        definition: 'Leaves grow one at a time, staggered on opposite sides of the stem as you move up.',
        diagram: 'alternate',
      },
      {
        term: 'Basal',
        definition: 'Leaves grow only from the base of the plant, at or near ground level. The stem itself is mostly leafless.',
        diagram: 'basal',
      },
      {
        term: 'Rosette',
        definition: 'Leaves arranged in a flat circular cluster at ground level, like a rose viewed from above.',
        diagram: 'basal',
      },
      {
        term: 'Whorled',
        definition: 'Three or more leaves grow from the same point on the stem, radiating outward like spokes.',
        diagram: 'whorled',
      },
    ],
  },
  {
    title: 'Leaf Form',
    terms: [
      {
        term: 'Simple leaf',
        definition: 'A single undivided leaf blade — one leaf per stem attachment point.',
        diagram: 'simple',
      },
      {
        term: 'Compound leaf',
        definition: 'A leaf divided into two or more distinct leaflets on a shared stalk. The whole structure counts as one leaf.',
        diagram: 'compound',
      },
      {
        term: 'Pinnate',
        definition: 'A compound leaf where leaflets are arranged in pairs along a central stalk, like a feather.',
      },
      {
        term: 'Bipinnate',
        definition: 'Doubly compound — each leaflet is itself divided into smaller leaflets, giving a very fine, lacy appearance.',
      },
      {
        term: 'Palmate',
        definition: 'Leaflets or lobes fan out from a central point, like fingers spreading from your palm.',
      },
      {
        term: 'Lobed',
        definition: 'A leaf with deep indentations that do not cut all the way through to the midrib. The leaf is still in one piece.',
      },
    ],
  },
  {
    title: 'Leaf Shape',
    terms: [
      {
        term: 'Lanceolate',
        definition: 'Narrow and tapering to a point at the tip — longer than wide, shaped like a lance head.',
      },
      {
        term: 'Ovate',
        definition: 'Egg-shaped, widest near the base and tapering toward the tip.',
      },
      {
        term: 'Obovate',
        definition: 'Egg-shaped but widest toward the tip rather than the base.',
      },
      {
        term: 'Linear',
        definition: 'Very narrow with nearly parallel sides along the whole length, like a grass blade.',
      },
      {
        term: 'Cordate',
        definition: 'Heart-shaped, with a notched indentation at the base where it meets the stem.',
      },
    ],
  },
  {
    title: 'Leaf Edge (Margin)',
    terms: [
      {
        term: 'Entire',
        definition: 'Smooth edge with no teeth, notches, or lobes — like the edge of a piece of paper.',
      },
      {
        term: 'Serrate',
        definition: 'Edges with sharp teeth that point forward toward the tip, like the teeth on a saw blade.',
      },
      {
        term: 'Toothed',
        definition: 'Edges with irregular or rounded teeth, more loosely than serrate.',
      },
      {
        term: 'Crenate',
        definition: 'Edges with rounded, scallop-like teeth — like the edge of a cookie cut with a round cutter.',
      },
    ],
  },
  {
    title: 'Stem Terms',
    terms: [
      {
        term: 'Node',
        definition: 'The point on a stem where a leaf, branch, or bud attaches. You can often feel a slight swelling.',
      },
      {
        term: 'Square stem',
        definition: 'A stem with four flattened sides so it feels distinctly square when you roll it between your fingers. Characteristic of the mint family.',
        diagram: 'square-stem',
      },
      {
        term: 'Clasping',
        definition: 'A leaf whose base wraps partway around the stem with no separate leaf stalk (petiole). The leaf appears to hug the stem.',
        diagram: 'clasping',
      },
      {
        term: 'Petiole',
        definition: 'The stalk that connects a leaf blade to the stem. Some leaves lack a petiole and attach directly (sessile or clasping).',
      },
      {
        term: 'Erect',
        definition: 'Growing upright and straight.',
      },
      {
        term: 'Branching',
        definition: 'Stem divides into multiple side branches above the base.',
      },
    ],
  },
  {
    title: 'Flower Terms',
    terms: [
      {
        term: 'Composite flower',
        definition: 'A flower head made up of many tiny individual flowers (florets) packed tightly together. Common in the daisy and aster family. What looks like one flower is actually dozens.',
        diagram: 'ray-disk',
      },
      {
        term: 'Ray',
        definition: 'The strap-shaped outer "petals" of a composite flower. They attract pollinators. (Example: the yellow petals on a Black-Eyed Susan.)',
      },
      {
        term: 'Disk',
        definition: 'The central button-like cluster of tiny tubular florets in a composite flower. (Example: the dark brown center of a Black-Eyed Susan.)',
      },
      {
        term: 'Tubular flower',
        definition: 'A flower shaped like a tube or funnel, with petals fused together along their length. Common in the mint and bellflower families.',
      },
      {
        term: 'Spike',
        definition: 'Flowers arranged along an elongated central stem with no individual flower stalks. The flowers attach directly to the main stem.',
      },
      {
        term: 'Reflexed petals',
        definition: 'Petals that bend sharply backward away from the center of the flower, like a swept-back umbrella in wind. Seen in shooting stars.',
      },
    ],
  },
  {
    title: 'Habitat Terms',
    terms: [
      {
        term: 'Prairie',
        definition: 'Open grassland dominated by native grasses and wildflowers, with no or very few trees. Often dry to mesic.',
      },
      {
        term: 'Savanna',
        definition: 'Grassland with scattered trees (typically oaks in Illinois) — open enough for sunlight to reach the ground.',
      },
      {
        term: 'Woodland',
        definition: 'Lightly shaded area under a partial tree canopy. More open than a forest.',
      },
      {
        term: 'Forest',
        definition: 'Densely shaded area with a full, closed tree canopy. Darker and cooler than woodland.',
      },
      {
        term: 'Fen',
        definition: 'A wetland fed by mineral-rich groundwater that seeps from the ground. Often supports rare plant communities.',
      },
      {
        term: 'Floodplain',
        definition: 'Low-lying land along a river or stream that floods periodically. Rich soils support distinctive plant communities.',
      },
      {
        term: 'Mesic',
        definition: 'A habitat with moderate moisture — not too wet, not too dry. Between wet prairie and dry upland.',
      },
      {
        term: 'Disturbed area',
        definition: 'Ground disturbed by human activity — roadsides, old fields, construction edges. Often supports weedy or opportunistic species.',
      },
    ],
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function GlossarySheet({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Field Glossary</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close glossary"
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
          >
            <Text style={styles.closeBtnText}>Done</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.terms.map((entry) => (
                <View key={entry.term} style={styles.termRow}>
                  {entry.diagram ? (
                    <View style={styles.termWithDiagram}>
                      <View style={styles.termTextBlock}>
                        <Text style={styles.termName}>{entry.term}</Text>
                        <Text style={styles.termDef}>{entry.definition}</Text>
                      </View>
                      <View style={styles.diagramWrapper}>
                        <LeafDiagram type={entry.diagram} />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.termName}>{entry.term}</Text>
                      <Text style={styles.termDef}>{entry.definition}</Text>
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
    backgroundColor: '#F3F0E8',
  },
  sheetHeader: {
    alignItems: 'center',
    backgroundColor: '#F3F0E8',
    borderBottomColor: '#D7DED0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetTitle: {
    color: '#1F3D2F',
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  closeBtnText: {
    color: '#2F6847',
    fontSize: 17,
    fontWeight: '600',
  },
  scrollContent: {
    gap: 20,
    padding: 20,
    paddingBottom: 48,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    backgroundColor: '#E8F0E4',
    color: '#1F3D2F',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  termRow: {
    borderTopColor: '#EEF2EB',
    borderTopWidth: 1,
    gap: 4,
    padding: 16,
  },
  termWithDiagram: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  termTextBlock: {
    flex: 1,
    gap: 4,
  },
  diagramWrapper: {
    alignItems: 'center',
    backgroundColor: '#EEF5EE',
    borderRadius: 10,
    padding: 8,
  },
  termName: {
    color: '#1F3D2F',
    fontSize: 16,
    fontWeight: '700',
  },
  termDef: {
    color: '#4A5B4D',
    fontSize: 14,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.7,
  },
});
