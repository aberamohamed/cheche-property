import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors, fontSizes, spacing } from "../utils/theme";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onActionPress
}: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {actionLabel ? (
      <View style={styles.action}>
        <Button title={actionLabel} onPress={onActionPress} />
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: spacing.xl
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: "800",
    textAlign: "center"
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textSoft,
    fontSize: fontSizes.md,
    textAlign: "center",
    lineHeight: 22
  },
  action: {
    marginTop: spacing.lg,
    width: "100%"
  }
});
