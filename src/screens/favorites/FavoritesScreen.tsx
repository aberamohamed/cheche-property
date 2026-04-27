import { useMemo, useRef, useState } from "react";
import { NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../components/Screen";
import { Colors } from "../../constants/Colors";
import { colors, layout, radius, spacing } from "../../utils/theme";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useProperties } from "../../hooks/useProperties";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { PropertyCard } from "../../components/PropertyCard";
import { SearchBar } from "../../components/SearchBar";
import { useTabsScrollBlurTarget } from "../../contexts/TabsScrollBlurContext";
import { tabHeaderFabContentPaddingTop } from "../../utils/tabHeaderFab";

export const FavoritesScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const { data, isLoading, error, refetch } = useProperties();
  const showLoading = useMinimumDisplay(isLoading, 3000);
  const [query, setQuery] = useState("");
  const [stickySearch, setStickySearch] = useState(false);
  const stickyScrollThresholdRef = useRef(0);
  const tabBlurTargetRef = useTabsScrollBlurTarget();
  /** Android: `TabHeaderFab` owns the tab `blurTarget`; avoid a second BlurView on the same ref. */
  const searchChromeBlurTargetRef =
    Platform.OS === "ios" ? tabBlurTargetRef : undefined;

  const filteredFavorites = useMemo(() => {
    if (!data) return [];
    const favorites = data.filter((item) => favoriteIds.includes(item.id));
    if (!query.trim()) return favorites;
    return favorites.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, favoriteIds, query]);

  if (error) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="Favorites are unavailable."
          description="We couldn't load the latest listings right now."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (showLoading || (isLoading && !data)) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Loading favorites..." />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="Favorites are unavailable."
          description="We couldn't load the latest listings right now."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<any>) => {
    const y = event.nativeEvent.contentOffset.y;
    const threshold = stickyScrollThresholdRef.current;
    if (threshold <= 0) return;

    const nextSticky = y >= threshold - 4;
    if (nextSticky !== stickySearch) {
      setStickySearch(nextSticky);
    }
  };

  return (
    <View style={styles.page}>
      <Screen scrollable={false} horizontalPadding={false}>
        <ScrollView
          style={styles.scroll}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: tabHeaderFabContentPaddingTop(insets.top) }
          ]}
        >
          <View
            style={[
              styles.stickyShell,
              stickySearch && {
                paddingTop: 2,
                marginHorizontal: -layout.pagePadding,
                paddingHorizontal: layout.pagePadding,
                borderRadius: 0,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
                backgroundColor: "transparent"
              }, stickySearch ? styles.stickyShellActive : null
            ]}
          >
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search your favorites..."
              blurTargetRef={searchChromeBlurTargetRef ?? undefined}
            />
          </View>

          <View
            style={styles.heroWrap}
            onLayout={(event) => {
              stickyScrollThresholdRef.current = event.nativeEvent.layout.y;
            }}
          >
            <LinearGradient
              colors={[
                Colors.palette.primary[700],
                Colors.palette.primary[800],
                Colors.palette.primary[1000]
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Text style={styles.heroKicker}>Favorites</Text>
              <Text style={styles.heroTitle}>Your saved properties</Text>
              <Text style={styles.heroText}>
                Easily revisit and compare the homes that caught your eye in Addis Ababa.
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.resultBlock}>
            {filteredFavorites.length === 0 ? (
              <EmptyState
                title={query ? "No results found" : "No saved properties yet"}
                description={query ? "Try a different search term." : "Tap the heart on any listing to keep it here for later."}
                actionLabel={query ? undefined : "Browse listings"}
                onActionPress={() => router.push("/search")}
              />
            ) : (
              filteredFavorites.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                  isFavorite
                  onPress={() =>
                    router.push({
                      pathname: "/property/[propertyId]",
                      params: { propertyId: item.id, agentName: item.agentName }
                    })
                  }
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: layout.pagePadding,
    paddingBottom: spacing.xxxl
  },
  heroWrap: {
    marginBottom: spacing.sm
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.text,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 5
  },
  heroKicker: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  heroTitle: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30
  },
  heroText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 20
  },
  stickyShell: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.background
  },
  stickyShellActive: {
    zIndex: 20
  },
  resultBlock: {
    paddingBottom: 0
  }
});
