import { StyleSheet, View } from 'react-native';

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

type LeafDiagramProps = {
  type: DiagramType;
};

const WIDTH = 96;
const HEIGHT = 108;
const CENTER_X = WIDTH / 2;

const STEM = '#3D6B4A';
const LEAF = '#5A9E6A';
const LEAF_LIGHT = '#82BF8F';
const DISK = '#C8902A';
const RAY = '#E8C44A';

function Stem({
  x = CENTER_X,
  top = 0,
  height = HEIGHT,
}: {
  x?: number;
  top?: number;
  height?: number;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: x - 1,
        top,
        width: 2,
        height,
        backgroundColor: STEM,
        borderRadius: 1,
      }}
    />
  );
}

function Leaf({
  cx,
  cy,
  width = 26,
  height = 13,
  angle = 0,
  color = LEAF,
}: {
  cx: number;
  cy: number;
  width?: number;
  height?: number;
  angle?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: cx - width / 2,
        top: cy - height / 2,
        width,
        height,
        borderRadius: height / 2,
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
      <Leaf cx={CENTER_X - 20} cy={22} angle={-25} />
      <Leaf cx={CENTER_X + 20} cy={22} angle={25} />
      <Leaf cx={CENTER_X - 20} cy={54} angle={-25} />
      <Leaf cx={CENTER_X + 20} cy={54} angle={25} />
      <Leaf cx={CENTER_X - 20} cy={86} angle={-25} />
      <Leaf cx={CENTER_X + 20} cy={86} angle={25} />
    </View>
  );
}

function AlternateLeaves() {
  return (
    <View style={styles.container}>
      <Stem />
      <Leaf cx={CENTER_X - 20} cy={18} angle={-30} />
      <Leaf cx={CENTER_X + 20} cy={40} angle={30} />
      <Leaf cx={CENTER_X - 20} cy={62} angle={-30} />
      <Leaf cx={CENTER_X + 20} cy={84} angle={30} />
    </View>
  );
}

function BasalLeaves() {
  return (
    <View style={styles.container}>
      <Stem top={0} height={60} />
      <Leaf cx={CENTER_X} cy={82} width={30} height={14} angle={0} />
      <Leaf cx={CENTER_X - 24} cy={78} width={28} height={13} angle={-45} />
      <Leaf cx={CENTER_X + 24} cy={78} width={28} height={13} angle={45} />
      <Leaf cx={CENTER_X - 34} cy={68} width={24} height={12} angle={-70} />
      <Leaf cx={CENTER_X + 34} cy={68} width={24} height={12} angle={70} />
    </View>
  );
}

function WhorledLeaves() {
  return (
    <View style={styles.container}>
      <Stem />
      <Leaf cx={CENTER_X} cy={28} width={26} height={12} angle={0} />
      <Leaf cx={CENTER_X} cy={28} width={26} height={12} angle={90} />
      <Leaf cx={CENTER_X} cy={28} width={26} height={12} angle={45} />
      <Leaf cx={CENTER_X} cy={28} width={26} height={12} angle={-45} />
      <Leaf cx={CENTER_X} cy={70} width={26} height={12} angle={0} />
      <Leaf cx={CENTER_X} cy={70} width={26} height={12} angle={90} />
      <Leaf cx={CENTER_X} cy={70} width={26} height={12} angle={45} />
      <Leaf cx={CENTER_X} cy={70} width={26} height={12} angle={-45} />
    </View>
  );
}

function CompoundLeaf() {
  return (
    <View style={styles.container}>
      <Stem x={CENTER_X} top={16} height={76} />
      <Leaf cx={CENTER_X - 18} cy={30} width={20} height={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X + 18} cy={30} width={20} height={10} angle={35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X - 18} cy={52} width={20} height={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X + 18} cy={52} width={20} height={10} angle={35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X - 18} cy={74} width={20} height={10} angle={-35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X + 18} cy={74} width={20} height={10} angle={35} color={LEAF_LIGHT} />
      <Leaf cx={CENTER_X} cy={16} width={20} height={10} angle={0} color={LEAF_LIGHT} />
    </View>
  );
}

function SimpleLeaf() {
  return (
    <View style={styles.container}>
      <Stem top={50} height={58} />
      <Leaf cx={CENTER_X} cy={34} width={52} height={44} angle={0} color={LEAF} />
      <View
        style={{
          position: 'absolute',
          left: CENTER_X - 1,
          top: 14,
          width: 2,
          height: 42,
          backgroundColor: STEM,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

function RayDisk() {
  const rays = 12;
  const rayLength = 20;
  const innerRadius = 14;
  const flowerCenterX = CENTER_X;
  const flowerCenterY = HEIGHT / 2;

  const rayElements = Array.from({ length: rays }, (_, index) => {
    const angleDeg = (index * 360) / rays;
    const angleRad = (angleDeg * Math.PI) / 180;
    const rx = flowerCenterX + (innerRadius + rayLength / 2) * Math.cos(angleRad);
    const ry = flowerCenterY + (innerRadius + rayLength / 2) * Math.sin(angleRad);

    return (
      <View
        key={index}
        style={{
          position: 'absolute',
          left: rx - 5,
          top: ry - 12,
          width: 10,
          height: rayLength,
          borderRadius: 5,
          backgroundColor: RAY,
          transform: [{ rotate: `${angleDeg + 90}deg` }],
        }}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Stem top={flowerCenterY + innerRadius} height={HEIGHT - (flowerCenterY + innerRadius)} />
      {rayElements}
      <View
        style={{
          position: 'absolute',
          left: flowerCenterX - innerRadius,
          top: flowerCenterY - innerRadius,
          width: innerRadius * 2,
          height: innerRadius * 2,
          borderRadius: innerRadius,
          backgroundColor: DISK,
        }}
      />
    </View>
  );
}

function ClaspingLeaf() {
  return (
    <View style={styles.container}>
      <Stem />
      <Leaf cx={CENTER_X - 22} cy={22} angle={-20} />
      <View
        style={{
          position: 'absolute',
          left: CENTER_X - 30,
          top: 50,
          width: 60,
          height: 40,
          borderRadius: 20,
          backgroundColor: LEAF,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: CENTER_X - 6,
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
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        },
      ]}
    >
      <View style={{ alignItems: 'center', gap: 6 }}>
        <View
          style={{
            width: 28,
            height: 28,
            backgroundColor: STEM,
            borderRadius: 3,
          }}
        />
        <View
          style={{
            width: 2,
            height: 50,
            backgroundColor: STEM,
          }}
        />
      </View>
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

export function LeafDiagram({ type }: LeafDiagramProps) {
  switch (type) {
    case 'opposite':
      return <OppositeLeaves />;
    case 'alternate':
      return <AlternateLeaves />;
    case 'basal':
      return <BasalLeaves />;
    case 'whorled':
      return <WhorledLeaves />;
    case 'compound':
      return <CompoundLeaf />;
    case 'simple':
      return <SimpleLeaf />;
    case 'ray-disk':
      return <RayDisk />;
    case 'clasping':
      return <ClaspingLeaf />;
    case 'square-stem':
      return <SquareStem />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    position: 'relative',
  },
});
