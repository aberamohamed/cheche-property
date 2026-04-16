import { ReactNode } from "react";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { colors, layout } from "../utils/theme";

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
  horizontalPadding?: boolean;
  edges?: Edge[];
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
}

export const Screen = ({
  children,
  scrollable = true,
  contentStyle,
  safeAreaStyle,
  horizontalPadding = true,
  edges = ["left", "right"],
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  keyboardShouldPersistTaps = "handled"
}: ScreenProps) => {
  const padding = horizontalPadding ? layout.pagePadding : 0;
  const keyboardBehavior = Platform.OS === "ios" ? "padding" : undefined;

  if (!scrollable) {
    const content = (
      <SafeAreaView edges={edges} style={[styles.safeArea, safeAreaStyle]}>
        <View style={[styles.content, { paddingHorizontal: padding }, contentStyle]}>{children}</View>
      </SafeAreaView>
    );

    if (!keyboardAvoiding) {
      return content;
    }

    return (
      <KeyboardAvoidingView style={styles.flex} behavior={keyboardBehavior} keyboardVerticalOffset={keyboardVerticalOffset}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  const scrollContent = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={[styles.scrollContent, { paddingHorizontal: padding }, contentStyle]}
    >
      {children}
    </ScrollView>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, safeAreaStyle]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={keyboardBehavior} keyboardVerticalOffset={keyboardVerticalOffset}>
          {scrollContent}
        </KeyboardAvoidingView>
      ) : (
        scrollContent
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0
  }
});
