import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "../utils/theme";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
}

export const Button = ({
  title,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : colors.primary} />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  }
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: "transparent"
  },
  danger: {
    backgroundColor: colors.danger
  }
});

const labelStyles = StyleSheet.create({
  primary: {
    color: "#FFFFFF"
  },
  secondary: {
    color: colors.text
  },
  ghost: {
    color: colors.primary
  },
  danger: {
    color: "#FFFFFF"
  }
});
