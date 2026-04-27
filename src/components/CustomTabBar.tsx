import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

const TAB_META: Record<string, { label: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  home: { label: "Home", icon: "home" },
  search: { label: "Search", icon: "search" },
  favorites: { label: "Favorites", icon: "favorite" },
  profile: { label: "Settings", icon: "settings" }
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const focusedOptions = descriptors?.[state.routes[state.index]?.key]?.options;
  const tabBarStyle = focusedOptions?.tabBarStyle as { display?: "none" } | undefined;
  if (tabBarStyle?.display === "none") return null;

  const tabOrder = ["home", "search", "favorites", "profile"];
  const orderedRoutes = tabOrder
    .map((name) => state.routes.find((route) => route.name === name))
    .filter((route): route is (typeof state.routes)[number] => Boolean(route));

  const padBottom = Math.max(insets.bottom, 6);

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View style={[styles.shell, { paddingBottom: padBottom }]}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />
        )}
        <View style={styles.inner}>
          {orderedRoutes.map((route) => {
            const isFocused = state.routes[state.index]?.key === route.key;
            const tab = TAB_META[route.name];
            if (!tab) return null;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={styles.tabButton}
              >
                <View style={[styles.iconBubble, isFocused && styles.iconBubbleActive]}>
                  <MaterialIcons
                    name={tab.icon}
                    size={isFocused ? 22 : 20}
                    color={isFocused ? "#FFFFFF" : colors.textSoft}
                  />
                </View>
                <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  shell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 56,
    borderRadius: 0,
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 12
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.96)"
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 8
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3
  },
  iconBubbleActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 17,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
    backgroundColor: "transparent"
  },
  labelActive: {
    color: colors.primary
  }
});
