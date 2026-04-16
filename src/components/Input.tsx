import { ReactNode } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet
} from "react-native";
import { colors, radius, spacing } from "../utils/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export const Input = ({ label, error, rightElement, style, ...props }: InputProps) => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={[styles.field, error ? styles.fieldError : null]}>
      <TextInput
        placeholderTextColor={colors.textSoft}
        style={[styles.input, style]}
        {...props}
      />
      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  field: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  fieldError: {
    borderColor: colors.danger
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12
  },
  right: {
    marginLeft: spacing.sm
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600"
  }
});
