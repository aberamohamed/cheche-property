import { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "src/constants/Colors";

interface SkeletonProps {
  height: number;
  width?: number | "auto" | `${number}%`;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pastel shimmer band — reads as “loading” without washing the whole UI in brand pink */
const SHIMMER_COLORS = [
  "rgba(0,0,0,0)",
  "rgba(227, 0, 116, 0.14)",
  "rgba(56, 189, 248, 0.22)",
  "rgba(52, 211, 153, 0.2)",
  "rgba(250, 204, 21, 0.24)",
  "rgba(255, 255, 255, 0.92)",
  "rgba(167, 139, 250, 0.22)",
  "rgba(251, 113, 133, 0.16)",
  "rgba(0,0,0,0)"
] as const;

const SHIMMER_LOCATIONS = [0, 0.12, 0.28, 0.4, 0.52, 0.62, 0.74, 0.88, 1] as const;

export const Skeleton = ({ height, width = "100%", radius = 16, style }: SkeletonProps) => {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      })
    );

    shimmerAnimation.start();
    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmer]);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-220, 220]
  });

  return (
    <View style={{ width, height, borderRadius: radius, overflow: "hidden" }}>
      <View
        style={[
          styles.base,
          {
            width: "100%",
            height: "100%",
            borderRadius: radius
          },
          style
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerMask,
          {
            borderRadius: radius,
            transform: [{ translateX: shimmerTranslate }]
          }
        ]}
      >
        <LinearGradient
          colors={[...SHIMMER_COLORS]}
          locations={[...SHIMMER_LOCATIONS]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.palette.neutral[200],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(15, 23, 42, 0.08)",
    overflow: "hidden"
  },
  shimmerMask: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    opacity: 0.95
  },
  shimmer: {
    flex: 1,
    width: 280
  }
});
