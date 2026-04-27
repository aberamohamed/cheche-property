import { useRef } from "react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BlurTargetView } from "expo-blur";
import { TabHeaderFab } from "../../../src/components/TabHeaderFab";
import { TabsScrollBlurContext } from "../../../src/contexts/TabsScrollBlurContext";

export default function HomeLayout() {
  const blurTargetRef = useRef<View | null>(null);

  return (
    <TabsScrollBlurContext.Provider value={blurTargetRef}>
      <View style={styles.root}>
        <BlurTargetView ref={blurTargetRef} style={styles.blurTarget} collapsable={false}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </BlurTargetView>
        <TabHeaderFab />
      </View>
    </TabsScrollBlurContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blurTarget: { flex: 1 }
});
