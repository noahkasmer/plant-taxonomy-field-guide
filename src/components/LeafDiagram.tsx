import { StyleSheet, View } from 'react-native';

// Pure View-based botanical schematic diagrams.
// Uses absolute positioning within a fixed container — no SVG required.

export type DiagramType =
  | 'opposite'
  | 'alternate'
  | 'basal'
  | 'whorled'
  | 'compound'
  | 'simple'
  | 'ray-disk'
  | 'clasping'
  | 'square-stem';

type Props = { type: DiagramType };

const W = 96;   // container width
const H = 108;  // container height
const CX = W / 2; // stem center x

const STEM_COLOR = '#3D6B4A';
const LEAF_COLOR = '#5A9E6A';
const LEAF_LIGHT = '#82BF8F';
const DISK_COLOR = '#C8902A';
const RAY_COLOR = '#E8C44A';

function Stem({ x = CX, top = 0, height = H }: { x?: number; top?: number; height?: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: x - 1,
        top,
        width: 2,
        height,
        backgroundColor: STEM_COLOR,
        borderRadius: 1,
      }}
    />
  );
}

function Leaf({
  cx,
  cy,
  w = 26,
  h = 13,
  angle = 0,
  color = LEAF_COLOR,
}: {
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  angle?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: h / 2,
        backgroundColor: color,
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

function OppositeLeaves() {
  return (
    <View style={styles.container}>
      <Stem />
      {/* Three opposite pairs */}
      <Leaf cx={CX - 20} cy={22} angle={-25} />
      <Leaf cx={CX + 20} cy={22} angle={25} />
      <Leaf cx={CX - 20} cy={54} angle={-25} />
      <Leaf cx={CX + 20} cy={54} angle={25} />
      <Leaf cx={CX - 20} cy={86} angle={-25} />
      <Leaf cx={CX + 20} cy={86} angle={25} />
    </View>
  );
}

function AlternateLeaves() {
  return (
    <View style={styles.container}>
      <Stem />
      {/* Four alternate leaves, staggered left-right */}
      <Leaf cx={CX - 20} cy={18} angle={-30} />
      <Leaf cx={CX + 20} cy={40} angle={30} />
      <Leaf cx={CX - 20} cy={62} angle={-30} />
      <Leaf cx={CX + 20} cy={84} angle={30} />
    </View>
  );
}

function BasalLeaves() {
  return (
    <View style={styles.container}>
      {/* Short stem in upper center */}
      <Stem top={0} height={60} />
      {/* Leaves radiating from base */}
      <Leaf cx={CX} cy={82} w={30} h={14} angle={0} />
      <Leaf cx={CX - 24} cy={78} w={28} h={13} angle={-45} />
      <Leaf cx={CX + 24} cy={78} w={28} h={13} angle={45} />
      <Leaf cx={CX - 34} cy={68} w={24} h={12} angle={-70} />
      <Leaf cx={CX + 34} cy={68} w={24} h={12} angle={70} />
    </View>
  );
}

function WhorledLeaves() {
  return (
    <View style={styles.container}>
      <Stem />
      {/* Whorl at mid-height: 4 leaves radiating from one node */}
      <Leaf cx={CX} cy={28} w={26} h={12} angle={0} />
      <Leaf cx={CX} cy={28} w={26} h={12} angle={90} />
      <Leaf cx={CX} cy={28} w={26} h={12} angle={45} />
      <Leaf cx={CX} cy={28} w={26} h={12} angle={-45} />
      {/* Second whorl lower */}
      <Leaf cx={CX} cy={70} w={26} h={12} angle={0} />
      <Leaf cx={CX} cy={70} w={26} h={12} angle={90} />
      <Leaf cx={CX} cy={70} w={26} h={12} angle={45} />
      <Leaf cx={CX} cy={70} w={26} h={12} angle={-45} />
    </View>
  );
}

function CompoundLeaf() {
  // One petiole, leaflets arranged pinnately
  return (
    <View style={styles.container}>
      {/* Central petiole / rachis */}
      <Stem x={CX} top={16} height={76} />
      {/* Paired leaflets along rachis */}
      <Leaf cx={CX - 18} cy={30} w={20} h={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CX + 18} cy={30} w={20} h={10} angle={35} color={LEAF_LIGHT} />
      <Leaf cx={CX - 18} cy={52} w={20} h={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CX + 18} cy={52} w={20} h={10} angle={35} color={LEAF_LIGHT} />
      <Leaf cx={CX - 18} cy={74} w={20} h={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CX + 18} cy={74} w={20} h={10} angle={35} color={LEAF_LIGHT} />
      {/* Terminal leaflet */}
      <Leaf cx={CX} cy={16} w={20} h={10} angle={0} color={LEAF_LIGHT} />
    </View>
  );
}

function SimpleLeaf() {
  return (
    <View style={styles.container}>
      {/* Stem */}
      <Stem top={50} height={58} />
      {/* Single broad leaf */}
      <Leaf cx={CX} cy={34} w={52} h={44} angle={0} color={LEAF_COLOR} />
      {/* Midrib */}
      <View
        style={{
          position: 'absolute',
          left: CX - 1,
          top: 14,
          width: 2,
          height: 42,
          backgroundColor: STEM_COLOR,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

function RayDisk() {
  // Composite flower: disk center + ray petals radiating out
  const rays = 12;
  const rayLength = 20;
  const innerR = 14;
  const outerCX = CX;
  const outerCY = H / 2;

  const rayElements = Array.from({ length: rays }, (_, i) => {
    const angleDeg = (i * 360) / rays;
    const angleRad = (angleDeg * Math.PI) / 180;
    const rx = outerCX + (innerR + rayLength / 2) * Math.cos(angleRad);
    const ry = outerCY + (innerR + rayLength / 2) * Math.sin(angleRad);
    return (
      <View
        key={i}
        style={{
          position: 'absolute',
          left: rx - 5,
          top: ry - 12,
          width: 10,
          height: rayLength,
          borderRadius: 5,
          backgroundColor: RAY_COLOR,
          transform: [{ rotate: `${angleDeg + 90}deg` }],
        }}
      />
    );
  });

  return (
    <View style={styles.container}>
      {/* Short stem */}
      <Stem top={outerCY + innerR} height={H - (outerCY + innerR)} />
      {rayElements}
      {/* Disk center */}
      <View
        style={{
          position: 'absolute',
          left: outerCX - innerR,
          top: outerCY - innerR,
          width: innerR * 2,
          height: innerR * 2,
          borderRadius: innerR,
          backgroundColor: DISK_COLOR,
        }}
      />
    </View>
  );
}

function ClaspingLeaf() {
  return (
    <View style={styles.container}>
      <Stem />
      {/* Upper non-clasping leaf */}
      <Leaf cx={CX - 22} cy={22} angle={-20} />
      {/* Clasping leaf: wide base wrapping stem */}
      <View
        style={{
          position: 'absolute',
          left: CX - 30,
          top: 50,
          width: 60,
          height: 40,
          borderRadius: 20,
          backgroundColor: LEAF_COLOR,
        }}
      />
      {/* Notch to show clasping: a gap cut from right side */}
      <View
        style={{
          position: 'absolute',
          left: CX - 6,
          top: 66,
          width: 12,
          height: 10,
          backgroundColor: '#EEF5EE',
        }}
      />
    </View>
  );
}

function SquareStem() {
  // Cross-section view of square stem vs round stem side by side
  return (
    <View style={[styles.container, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }]}>
      {/* Square cross-section */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <View
          style={{
            width: 28,
            height: 28,
            backgroundColor: STEM_COLOR,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            width: 2,
            height: 50,
            backgroundColor: STEM_COLOR,
          }}
        />
      </View>
      {/* Round cross-section */}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <View
          style={{
            width: 28,
            height: 28,
            backgroundColor: '#A0A090',
            borderRadius: 14,
          }}
        />
        <View
          style={{
            width: 2,
            height: 50,
            backgroundColor: '#A0A090',
          }}
        />
      </View>
    </View>
  );
}

export function LeafDiagram({ type }: Props) {
  switch (type) {
    case 'opposite': return <OppositeLeaves />;
    case 'alternate': return <AlternateLeaves />;
    case 'basal': return <BasalLeaves />;
    case 'whorled': return <WhorledLeaves />;
    case 'compound': return <CompoundLeaf />;
    case 'simple': return <SimpleLeaf />;
    case 'ray-disk': return <RayDisk />;
    case 'clasping': return <ClaspingLeaf />;
    case 'square-stem': return <SquareStem />;
    default: return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: W,
    height: H,
    position: 'relative',
  },
});
