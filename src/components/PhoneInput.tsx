import { ReactNode } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius, spacing } from "../utils/theme";

interface PhoneInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: ReactNode;
}

export const PhoneInput = ({ label, error, helperText, rightElement, style, ...props }: PhoneInputProps) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <View style={styles.prefixBlock}>
          <Text style={styles.flag}>🇪🇹</Text>
          <Text style={styles.countryCode}>+251</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          placeholderTextColor={colors.textSoft}
          style={[styles.input, style]}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          {...props}
        />
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

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
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  fieldError: {
    borderColor: colors.danger
  },
  prefixBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  flag: {
    fontSize: 18,
    lineHeight: 22
  },
  countryCode: {
    color: colors.textSoft,
    fontSize: 16,
    fontWeight: "700"
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginRight: spacing.sm
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 5,
    letterSpacing: 0.5
  },
  right: {
    marginLeft: spacing.sm
  },
  helper: {
    marginTop: spacing.xs,
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "500"
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600"
  }
});
