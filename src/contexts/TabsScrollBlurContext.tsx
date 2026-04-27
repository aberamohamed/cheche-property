import { createContext, useContext, type RefObject } from "react";
import { View } from "react-native";

/** Ref attached to each tab stack’s `BlurTargetView` so floating chrome can blur scroll content. */
export const TabsScrollBlurContext = createContext<RefObject<View | null> | null>(null);

export function useTabsScrollBlurTarget(): RefObject<View | null> | null {
  return useContext(TabsScrollBlurContext);
}
