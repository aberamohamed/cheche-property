import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radius, spacing } from "../utils/theme";
import { Skeleton } from "./Skeleton";

interface LoadingStateProps {
  label?: string;
  /**
   * When false, skips the fake title row (for screens that already use a native stack header).
   */
  showPlaceholderHeader?: boolean;
}

export const LoadingState = ({
  label = "Loading properties...",
  showPlaceholderHeader = true
}: LoadingStateProps) => (
  <View style={styles.container}>
    {showPlaceholderHeader ? (
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Skeleton height={20} width="42%" radius={999} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Skeleton height={34} width={84} radius={999} />
      </View>
    ) : (
      <View style={styles.embeddedIntro}>
        <Text style={styles.label}>{label}</Text>
      </View>
    )}

    <View style={styles.card}>
      <Skeleton height={180} radius={radius.xl} />
      <View style={styles.cardBody}>
        <Skeleton height={22} width="62%" radius={999} />
        <Skeleton height={14} width="48%" radius={999} style={styles.spacerSm} />
        <Skeleton height={14} width="82%" radius={999} style={styles.spacerSm} />
        <View style={styles.row}>
          <Skeleton height={30} width={72} radius={999} />
          <Skeleton height={30} width={72} radius={999} />
          <Skeleton height={30} width={72} radius={999} />
        </View>
      </View>
    </View>

    <View style={styles.card}>
      <Skeleton height={180} radius={radius.xl} />
      <View style={styles.cardBody}>
        <Skeleton height={22} width="55%" radius={999} />
        <Skeleton height={14} width="44%" radius={999} style={styles.spacerSm} />
        <Skeleton height={14} width="78%" radius={999} style={styles.spacerSm} />
        <View style={styles.row}>
          <Skeleton height={30} width={72} radius={999} />
          <Skeleton height={30} width={72} radius={999} />
          <Skeleton height={30} width={72} radius={999} />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.lg
  },
  embeddedIntro: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45
  },
  headerCopy: {
    flex: 1,
    gap: spacing.sm
  },
  label: {
    color: colors.textSoft,
    fontSize: fontSizes.md,
    fontWeight: "600"
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.sm
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs
  },
  spacerSm: {
    marginTop: 2
  }
});
