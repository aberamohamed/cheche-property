import type { RefObject } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../utils/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  /**
   * Android (SDK 31+): ref to a `BlurTargetView` that wraps the scrollable content behind this bar.
   * Without it, Android uses a frosted solid fallback (expo-blur defaults to `none` there).
   */
  blurTargetRef?: RefObject<View | null>;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by city, title, or keyword",
  style,
  blurTargetRef
}: SearchBarProps) => {
  const androidBlur = Platform.OS === "android" && blurTargetRef;

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={72} tint="light" style={StyleSheet.absoluteFill} />
      ) : androidBlur ? (
        <BlurView
          intensity={88}
          tint="light"
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTargetRef}
          blurReductionFactor={3}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidFrostFallback]} />
      )}
      <View style={styles.inner} pointerEvents="box-none">
        <Ionicons name="search" size={18} color={colors.textSoft} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoft}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          underlineColorAndroid="transparent"
        />
        {value ? (
          <Pressable onPress={() => onChangeText("")} hitSlop={12} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.textSoft} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border
  },
  inner: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: "transparent"
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 0,
    backgroundColor: "transparent"
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center"
  },
  /** Used on Android when no BlurTargetView ref (older SDK or parent not wired). */
  androidFrostFallback: {
    backgroundColor: "rgba(255, 255, 255, 0.88)"
  }
});
