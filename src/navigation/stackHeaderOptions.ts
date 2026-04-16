import { Platform } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { colors } from "../utils/theme";

const isIOS26OrNewer = Platform.OS === "ios" && Number(Platform.Version) >= 26;

type GlassHeaderOptions = {
  hideTitle?: boolean;
};

export const createGlassStackHeaderOptions = ({
  hideTitle = false
}: GlassHeaderOptions = {}): NativeStackNavigationOptions => ({
  headerShadowVisible: false,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colors.text,
  headerTransparent: Platform.OS === "ios",
  headerBlurEffect:
    Platform.OS === "ios" && !isIOS26OrNewer ? "systemUltraThinMaterial" : undefined,
  title: hideTitle ? "" : undefined,
  headerTitle: hideTitle ? () => null : undefined,
  scrollEdgeEffects: isIOS26OrNewer
    ? {
      top: "soft"
    }
    : undefined,
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? "#FFFFFF" : "transparent"
  },
  headerBackTitle: "",
  headerTitleAlign: "center",
  contentStyle: {
    backgroundColor: colors.background
  }
});
