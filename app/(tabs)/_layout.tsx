import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/utils/theme";

export default function TabsLayout() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (!token && !redirected.current) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [router, token]);

  if (!token) {
    return null;
  }

  return (
    <NativeTabs
      tintColor={colors.primary}
      labelStyle={{
        color: colors.textSoft,
        fontSize: 12,
        fontWeight: "600"
      }}
      labelVisibilityMode={Platform.OS === "android" ? "labeled" : undefined}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "magnifyingglass", selected: "magnifyingglass" }}
          md="search"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "heart", selected: "heart.fill" }} md="favorite" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
