import { Platform } from "react-native";
import { Redirect } from "expo-router";
import { withLayoutContext } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useAuthStore } from "../../src/store/authStore";
import CustomTabBar from "../../src/components/CustomTabBar";
import { TabHeader } from "../../src/components/TabHeader";
import { colors } from "../../src/utils/theme";

const BottomTabsNavigator = createBottomTabNavigator();
const ExpoBottomTabs = withLayoutContext(BottomTabsNavigator.Navigator);

export default function TabsLayout() {
  const token = useAuthStore((state) => state.token);
  const useCustomTabBar = Platform.OS === "android" || (Platform.OS === "ios" && Number(Platform.Version) < 26);

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (useCustomTabBar) {
    return (
      <ExpoBottomTabs
        screenOptions={{
          headerShown: true,
          header: () => <TabHeader />
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      />
    );
  }

  return (
    <NativeTabs
      tintColor={colors.primary}
      labelStyle={{
        color: colors.textSoft,
        fontSize: 12,
        fontWeight: "600"
      }}
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
