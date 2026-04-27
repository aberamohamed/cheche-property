import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { BlurView } from "expo-blur";
import { initialWindowMetrics, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, layout, spacing } from "../utils/theme";
import { setLocale, useLanguageChange } from "../i18n";
import { useTabsScrollBlurTarget } from "../contexts/TabsScrollBlurContext";
import { TAB_HEADER_FAB_ROW_MIN_HEIGHT } from "../utils/tabHeaderFab";

const SEGMENT_INSET = 3;

/**
 * Full-bleed blurred tab header (edge-to-edge from screen top; logo + language inset by safe area).
 * Requires parent `BlurTargetView` + `TabsScrollBlurContext` ref.
 */
export function TabHeaderFab() {
  const insets = useSafeAreaInsets();
  const fallbackTop = initialWindowMetrics?.insets.top ?? 0;
  const insetTop =
    insets.top > 0
      ? insets.top
      : fallbackTop > 0
        ? fallbackTop
        : Platform.OS === "android"
          ? StatusBar.currentHeight ?? 0
          : 0;

  const locale = useLanguageChange();
  const blurTargetRef = useTabsScrollBlurTarget();
  const androidBlur = Platform.OS === "android" && blurTargetRef;

  return (
    <View pointerEvents="box-none" style={styles.anchor}>
      <View style={styles.strip}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        ) : androidBlur ? (
          <BlurView
            intensity={90}
            tint="light"
            blurMethod="dimezisBlurViewSdk31Plus"
            blurTarget={blurTargetRef}
            blurReductionFactor={3}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidFrost]} />
        )}
        <View style={[styles.row, { paddingTop: insetTop - 12, paddingBottom: spacing.sm - 5 }]}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Cheche"
          />
          <View style={styles.flex} />
          <LanguageSegmentedControl locale={locale} />
        </View>
      </View>
    </View>
  );
}

function LanguageSegmentedControl({ locale }: { locale: string }) {
  const isAm = locale === "am";
  const translateX = useRef(new Animated.Value(0)).current;
  const [slotWidth, setSlotWidth] = useState(0);
  const lastLocaleAm = useRef(isAm);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    const slot = Math.max(0, (w - SEGMENT_INSET * 2) / 2);
    setSlotWidth(slot);
    translateX.setValue(isAm ? slot : 0);
  };

  useEffect(() => {
    if (slotWidth <= 0) return;
    if (lastLocaleAm.current === isAm) return;
    lastLocaleAm.current = isAm;
    Animated.spring(translateX, {
      toValue: isAm ? slotWidth : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 90
    }).start();
  }, [isAm, slotWidth, translateX]);

  return (
    <View
      style={styles.segmentTrack}
      onLayout={onTrackLayout}
      accessibilityRole="tablist"
      accessibilityLabel="Language"
    >
      {slotWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.segmentKnob,
            {
              width: slotWidth,
              transform: [{ translateX }]
            }
          ]}
        />
      ) : null}
      <View style={styles.segmentRow}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: !isAm }}
          onPress={() => setLocale("en")}
          style={({ pressed }) => [styles.segmentCell, pressed && styles.segmentCellPressed]}
        >
          <Text style={[styles.segmentLabel, !isAm && styles.segmentLabelActive]}>Eng</Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: isAm }}
          onPress={() => setLocale("am")}
          style={({ pressed }) => [styles.segmentCell, pressed && styles.segmentCellPressed]}
        >
          <Text style={[styles.segmentLabel, isAm && styles.segmentLabelActive]}>Amh</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    elevation: 12
  },
  strip: {
    width: "100%",
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.08)"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TAB_HEADER_FAB_ROW_MIN_HEIGHT,
    paddingHorizontal: layout.pagePadding,
    backgroundColor: "transparent"
  },
  flex: { flex: 1 },
  logo: {
    height: 26,
    width: 100,
    maxWidth: "42%"
  },
  segmentTrack: {
    minWidth: 132,
    height: 36,
    borderRadius: 999,
    padding: SEGMENT_INSET,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, 0.08)",
    justifyContent: "center"
  },
  segmentKnob: {
    position: "absolute",
    left: SEGMENT_INSET,
    top: SEGMENT_INSET,
    bottom: SEGMENT_INSET,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  segmentCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
    zIndex: 1
  },
  segmentCellPressed: {
    opacity: 0.85
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: colors.textSoft
  },
  segmentLabelActive: {
    color: colors.primary,
    fontWeight: "800"
  },
  androidFrost: {
    backgroundColor: "rgba(255, 255, 255, 0.92)"
  }
});
