import { Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
};

export function PrimaryButton({
  label,
  onPress,
  tone = 'primary',
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        tone === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, tone === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 14,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  primary: {
    backgroundColor: '#2F6B43',
  },
  secondary: {
    backgroundColor: '#DCE8D8',
    borderColor: '#2F6B43',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#1F3D2F',
  },
});
