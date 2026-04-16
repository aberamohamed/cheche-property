import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, spacing } from "../utils/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  onActionPress
}: SectionHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {actionLabel ? (
      <Pressable onPress={onActionPress} hitSlop={10}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  left: {
    flex: 1,
    paddingRight: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: fontSizes.sm,
    lineHeight: 20
  },
  action: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: "700"
  }
});
