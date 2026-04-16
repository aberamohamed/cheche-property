import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "src/constants/Colors";

interface SkeletonProps {
  height: number;
  width?: number | "auto" | `${number}%`;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({ height, width = "100%", radius = 16, style }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 900,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true
        })
      ])
    );

    animation.start();
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    );

    shimmerAnimation.start();
    return () => {
      animation.stop();
      shimmerAnimation.stop();
    };
  }, [opacity, shimmer]);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-140, 140]
  });

  return (
    <View style={{ width, height, borderRadius: radius, overflow: "hidden" }}>
      <Animated.View
        style={[
          styles.base,
          {
            width: "100%",
            height: "100%",
            borderRadius: radius,
            opacity
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
            opacity,
            transform: [{ translateX: shimmerTranslate }]
          }
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.9)", "transparent"]}
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
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(227, 0, 116, 0.14)",
    overflow: "hidden"
  },
  shimmerMask: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden"
  },
  shimmer: {
    flex: 1,
    width: 180
  }
});
