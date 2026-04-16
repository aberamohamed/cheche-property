import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../utils/theme";

interface StatCardProps {
  label: string;
  value: string;
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  label: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "600"
  }
});
