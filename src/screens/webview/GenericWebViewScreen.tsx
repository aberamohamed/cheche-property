import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { colors, spacing } from "../../utils/theme";
import { Screen } from "../../components/Screen";

const DEFAULT_WEB_URL = "https://realty.cheche.et/dashboard";

const buildInjectedJavaScript = (accessToken: string, refreshToken: string | null) => `
  (function () {
    try {
      var accessToken = ${JSON.stringify(accessToken)};
      var refreshToken = ${JSON.stringify(refreshToken)};
      var tokenPairs = [
        ["token", accessToken],
        ["accessToken", accessToken],
        ["authToken", accessToken],
        ["reltyToken", accessToken],
        ["refreshToken", refreshToken]
      ];
      tokenPairs.forEach(function (pair) {
        try {
          if (pair[1]) {
            localStorage.setItem(pair[0], pair[1]);
          }
        } catch (err) {}
      });
      try {
        document.cookie = "token=" + encodeURIComponent(accessToken) + "; path=/";
        document.cookie = "accessToken=" + encodeURIComponent(accessToken) + "; path=/";
        if (refreshToken) {
          document.cookie = "refreshToken=" + encodeURIComponent(refreshToken) + "; path=/";
        }
      } catch (err) {}
      window.__RELty_TOKEN = accessToken;
    } catch (err) {}
  })();
  true;
`;

export const GenericWebViewScreen = () => {
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const params = useLocalSearchParams<{ url?: string; title?: string }>();

  const targetUrl = typeof params.url === "string" && params.url.trim() ? params.url : DEFAULT_WEB_URL;
  const injectedJavaScript = useMemo(
    () => (token ? buildInjectedJavaScript(token, refreshToken) : ""),
    [refreshToken, token]
  );

  if (!token) {
    return (
      <Screen scrollable={false}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Please sign in first.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: targetUrl,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Auth-Token": token
          }
        }}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.background
  },
  loadingText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600"
  }
});
