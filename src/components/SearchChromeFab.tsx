import type { ComponentProps, RefObject } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/theme";

export type SearchChromeFabIconName = ComponentProps<typeof Ionicons>["name"];

export type SearchChromeFabAction = {
  label: string;
  icon: SearchChromeFabIconName;
  onPress: () => void;
  active?: boolean;
};

export interface SearchChromeFabProps {
  left: SearchChromeFabAction;
  right: SearchChromeFabAction;
  /** Android: optional `BlurTargetView` ref; omit when another surface already uses the same target. */
  blurTargetRef?: RefObject<View | null>;
}

/** Distance from screen bottom to the FAB (tab bar + safe area handled visually). */
export const SEARCH_CHROME_FAB_BOTTOM = Platform.select({ ios: 95, android: 24, default: 24 });

/**
 * Shared floating pill for Search list / Search map (Map·Filters vs List·Save).
 */
export function SearchChromeFab({ left, right, blurTargetRef }: SearchChromeFabProps) {
  const androidBlur = Platform.OS === "android" && blurTargetRef;

  const renderAction = (slot: SearchChromeFabAction) => {
    const active = Boolean(slot.active);
    return (
      <Pressable
        onPress={slot.onPress}
        style={({ pressed }) => [
          styles.action,
          active ? styles.actionActive : null,
          pressed && styles.pressed
        ]}
      >
        <Ionicons name={slot.icon} size={18} color={active ? "#FFFFFF" : colors.primary} />
        <Text style={[styles.label, active ? styles.labelActive : null]}>{slot.label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View style={styles.pill}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={78} tint="light" style={StyleSheet.absoluteFill} />
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
          <View style={[StyleSheet.absoluteFill, styles.androidFrost]} />
        )}
        <View style={styles.inner}>
          {renderAction(left)}
          <View style={styles.divider} />
          {renderAction(right)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: SEARCH_CHROME_FAB_BOTTOM,
    alignItems: "center"
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
   
  },
  inner: {
    flexDirection: "row",
    alignItems: "center"
  },
  androidFrost: {
    backgroundColor: "rgba(255, 255, 255, 0.9)"
  },
  action: {
    minWidth: 110,
    minHeight: 40,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999
  },
  actionActive: {
    backgroundColor: colors.primary
  },
  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800"
  },
  labelActive: {
    color: "#FFFFFF"
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 2
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  }
});
