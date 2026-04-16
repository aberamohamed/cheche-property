import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "../utils/theme";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const FilterChip = ({ label, selected = false, onPress }: FilterChipProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.base,
      selected ? styles.selected : null,
      pressed ? styles.pressed : null
    ]}
  >
    <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }]
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },
  selectedLabel: {
    color: colors.primary
  }
});
