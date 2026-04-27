import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "../src/services/queryClient";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/utils/theme";
import { createGlassStackHeaderOptions } from "../src/navigation/stackHeaderOptions";
import { PreferencesProvider } from "../src/contexts/PreferencesContext";

SplashScreen.preventAutoHideAsync().catch(() => { });

function SplashFallback() {
  return (
    <View style={styles.splash}>
      <Image source={require("../assets/icon.png")} style={styles.splashLogo} resizeMode="contain" />
    </View>
  );
}

export default function RootLayout() {
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [hydrated]);

  if (!hydrated) {
    return <SplashFallback />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <PreferencesProvider>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={createGlassStackHeaderOptions()}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="property/[propertyId]"
                options={{
                  title: "Property details"
                }}
              />
              <Stack.Screen
                name="listing/new"
                options={{
                  title: "Create listing"
                }}
              />
              <Stack.Screen
                name="listing/[propertyId]"
                options={{
                  title: "Edit listing"
                }}
              />
              <Stack.Screen
                name="dashboard"
                options={{
                  title: "Rent dashboard"
                }}
              />
              <Stack.Screen
                name="webview"
                options={{
                  title: "Rent dashboard"
                }}
              />
              <Stack.Screen
                name="chat/[propertyId]"
                options={{
                  title: "Chat",
                }}
              />
            </Stack>
          </QueryClientProvider>
        </PreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  splashLogo: {
    width: 200,
    height: 200,
    borderRadius: 40,
    overflow: "hidden"
  }
});
