import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../components/Screen";
import { Colors } from "../../constants/Colors";
import { colors, radius, spacing, layout } from "../../utils/theme";
import { useProperties } from "../../hooks/useProperties";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";
import { useFavoritesStore } from "../../store/favoritesStore";
import { Property } from "../../types";
import { LoadingState } from "../../components/LoadingState";
import { EmptyState } from "../../components/EmptyState";
import { PropertySection } from "../../components/PropertySection";
import { SectionHeader } from "../../components/SectionHeader";
import { PropertyCard } from "../../components/PropertyCard";
import { Button } from "../../components/Button";

export const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useProperties();
  const showLoading = useMinimumDisplay(isLoading, 3000);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [stickySearch, setStickySearch] = useState(false);
  const searchBarYRef = useRef(0);

  if (error) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="We couldn't load listings."
          description="The app will automatically fall back to local sample data, but the fetch still needs a retry."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (showLoading || (isLoading && !data)) {
    return (
      <Screen scrollable={false}>
        <LoadingState />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="We couldn't load listings."
          description="The app will automatically fall back to local sample data, but the fetch still needs a retry."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<any>) => {
    const y = event.nativeEvent.contentOffset.y;
    const threshold = searchBarYRef.current;
    if (threshold <= 0) return;

    const nextSticky = y >= threshold - 4;
    if (nextSticky !== stickySearch) {
      setStickySearch(nextSticky);
    }
  };

  const featured = data.filter((item) => item.featured);
  const recent = [...data].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
  const rentals = data.filter((item) => item.category === "rent").slice(0, 5);
  const sales = data.filter((item) => item.category === "sale").slice(0, 5);

  const openProperty = (property: Property) => {
    router.push(`/property/${property.id}`);
  };

  return (
    <Screen scrollable={false} horizontalPadding={false}>
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroWrap, { paddingTop: (Platform.OS === 'ios' && Number(Platform.Version) >= 26) ? insets.top + spacing.lg + 20 : spacing.lg + 10 }]}>
          <LinearGradient
            colors={[
              Colors.palette.primary[700],
              Colors.palette.primary[800],
              Colors.palette.primary[1000]
            ]}
            style={styles.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.kicker}>Relty marketplace</Text>
            <Text style={styles.heroTitle}>Discover rentals and homes with a premium feel.</Text>
            <Text style={styles.heroText}>
              Modern browsing, fast filters, and trusted property data for your next move.
            </Text>

            <View style={styles.heroActions}>
              <Button title="Browse listings" variant="secondary" onPress={() => router.push("/search")} />
              <Button title="Create listing" onPress={() => router.push("/listing/new")} />
            </View>
          </LinearGradient>
        </View>

        <View
          onLayout={(event) => {
            searchBarYRef.current = event.nativeEvent.layout.y;
          }}
          style={[
            styles.stickyShell,
            stickySearch && {
              paddingTop: insets.top + spacing.sm,
              marginHorizontal: -layout.pagePadding,
              paddingHorizontal: layout.pagePadding,
              borderRadius: 0,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)"
            }
          ]}
        >

          {/* <Pressable style={styles.searchBar} onPress={() => router.push("/search")}>
            <Ionicons name="search" size={18} color={colors.textSoft} />
            <Text style={styles.searchText}>Search by location, price, or type</Text>
          </Pressable> */}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Featured homes" subtitle="Hand-picked listings with high conversion potential" />
          {featured.length > 0 ? (
            <PropertySection
              title=""
              properties={featured}
              favoriteIds={favoriteIds}
              onPressProperty={openProperty}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <Text style={styles.emptyInline}>No featured properties right now.</Text>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Latest arrivals" subtitle="Fresh inventory from local agents" />
          {recent.slice(0, 2).map((item) => (
            <PropertyCard
              key={item.id}
              property={item}
              isFavorite={favoriteIds.includes(item.id)}
              onPress={() => openProperty(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          ))}
        </View>

        <PropertySection
          title="For rent"
          subtitle="Flexible homes for short- and long-term stays"
          properties={rentals}
          favoriteIds={favoriteIds}
          onPressProperty={openProperty}
          onToggleFavorite={toggleFavorite}
          onSeeAll={() => router.push("/search")}
        />

        <PropertySection
          title="For sale"
          subtitle="Ownership opportunities across the city"
          properties={sales}
          favoriteIds={favoriteIds}
          onPressProperty={openProperty}
          onToggleFavorite={toggleFavorite}
          onSeeAll={() => router.push("/search")}
        />

        <View style={styles.section}>
          <SectionHeader title="Quick snapshot" subtitle="At a glance" />
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotCard}>
              <Text style={styles.snapshotValue}>{data.length}</Text>
              <Text style={styles.snapshotLabel}>Properties</Text>
            </View>
            <View style={styles.snapshotCard}>
              <Text style={styles.snapshotValue}>{featured.length}</Text>
              <Text style={styles.snapshotLabel}>Featured</Text>
            </View>
            <View style={styles.snapshotCard}>
              <Text style={styles.snapshotValue}>{favoriteIds.length}</Text>
              <Text style={styles.snapshotLabel}>Saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.pagePadding,
    paddingBottom: spacing.xxxl + 100
  },
  heroWrap: {
    marginBottom: spacing.sm
  },
  hero: {
    padding: spacing.xl,
    borderRadius: radius.xl
  },
  kicker: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1
  },
  heroTitle: {
    marginTop: spacing.sm,
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38
  },
  heroText: {
    marginTop: spacing.sm,
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 22
  },
  stickyShell: {
    marginBottom: spacing.md
  },
  searchBar: {
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: Colors.palette.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  searchText: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600"
  },
  heroActions: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm
  },
  section: {
    marginBottom: spacing.xl
  },
  emptyInline: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600"
  },
  snapshotRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  snapshotCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  snapshotValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  snapshotLabel: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "600"
  }
});
