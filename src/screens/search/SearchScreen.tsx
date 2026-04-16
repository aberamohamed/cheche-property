import { useMemo, useRef, useState } from "react";
import { Animated, FlatList, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../components/Screen";
import { colors, layout, radius, spacing } from "../../utils/theme";
import { useProperties } from "../../hooks/useProperties";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";
import { useFavoritesStore } from "../../store/favoritesStore";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { FilterChip } from "../../components/FilterChip";
import { Input } from "../../components/Input";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyType } from "../../types";
import { SearchBar } from "../../components/SearchBar";
import { SearchFloatingActions } from "../../components/SearchFloatingActions";
import { Colors } from "src/constants/Colors";

const propertyTypes: Array<PropertyType | "All"> = [
  "All",
  "Apartment",
  "Villa",
  "Townhouse",
  "Studio",
  "Penthouse",
  "Office"
];
const categories: Array<"All" | "rent" | "sale"> = ["All", "rent", "sale"];

export const SearchScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PropertyType | "All">("All");
  const [category, setCategory] = useState<"All" | "rent" | "sale">("All");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [stickySearch, setStickySearch] = useState(false);
  const searchBarYRef = useRef(0);

  const filters = useMemo(
    () => ({
      query,
      type,
      category,
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    }),
    [query, type, category, location, minPrice, maxPrice]
  );

  const { data, isLoading, error, refetch } = useProperties(filters);
  const showLoading = useMinimumDisplay(isLoading, 3000);
  const mapParams = useMemo(
    () => ({
      query: query || undefined,
      type: type === "All" ? undefined : type,
      category: category === "All" ? undefined : category,
      location: location || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined
    }),
    [query, type, category, location, minPrice, maxPrice]
  );

  const handleScroll = (event: NativeSyntheticEvent<any>) => {
    const y = event.nativeEvent.contentOffset.y;
    const threshold = searchBarYRef.current;

    if (threshold <= 0) {
      return;
    }

    const nextSticky = y >= threshold - 4;
    if (nextSticky !== stickySearch) {
      setStickySearch(nextSticky);
    }
  };

  if (error) {
    return (
      <Screen>
        <EmptyState
          title="Search is unavailable."
          description="We fell back to local data, but the search query needs another attempt."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (showLoading || (isLoading && !data)) {
    return (
      <Screen>
        <LoadingState label="Searching properties..." />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <EmptyState
          title="Search is unavailable."
          description="We fell back to local data, but the search query needs another attempt."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  const listContent = (
    <View style={styles.resultBlock}>
      {data.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="Try broadening your price range or changing the location."
        />
      ) : (
        data.map((item) => (
          <PropertyCard
            key={item.id}
            property={item}
            isFavorite={favoriteIds.includes(item.id)}
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
  );

  return (
    <View style={styles.page}>
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
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Text style={styles.heroKicker}>Search</Text>
              <Text style={styles.heroTitle}>Find the right place in Addis Ababa</Text>
              <Text style={styles.heroText}>
                Use smart filters, price ranges, and map context to explore rentals and homes.
              </Text>
            </LinearGradient>
          </View>

          <View
            onLayout={(event) => {
              searchBarYRef.current = event.nativeEvent.layout.y;
            }}
            style={[
              styles.stickyShell,
              stickySearch && {
                paddingTop: (Platform.OS === 'ios' && Number(Platform.Version) >= 26) ? insets.top + spacing.sm : 0,
                marginHorizontal: -layout.pagePadding,
                paddingHorizontal: layout.pagePadding,
                borderRadius: 0,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
                backgroundColor: "transparent"
              },
              stickySearch ? styles.stickyShellActive : null
            ]}
          >
            {stickySearch && (
              <View
                style={StyleSheet.absoluteFill}
              />
            )}
            <SearchBar value={query} onChangeText={setQuery} />
          </View>

          {filtersVisible ? (
            <View style={styles.filtersBlock}>
              <Text style={styles.groupLabel}>Property type</Text>
              <FlatList
                data={propertyTypes}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
                renderItem={({ item }) => (
                  <FilterChip label={item} selected={type === item} onPress={() => setType(item)} />
                )}
              />

              <Text style={styles.groupLabel}>Category</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
                renderItem={({ item }) => (
                  <FilterChip
                    label={item === "All" ? "All" : item === "rent" ? "For rent" : "For sale"}
                    selected={category === item}
                    onPress={() => setCategory(item)}
                  />
                )}
              />

              <View style={styles.priceRow}>
                <View style={styles.priceField}>
                  <Input
                    placeholder="Min price"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                  />
                </View>
                <View style={styles.priceField}>
                  <Input
                    placeholder="Max price"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                  />
                </View>
              </View>

              <Input placeholder="Bole, CMC, Piassa..." value={location} onChangeText={setLocation} />
            </View>
          ) : null}

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>{data.length} results</Text>
            <Button
              title="Create listing"
              variant="secondary"
              onPress={() => router.push("/listing/new")}
            />
          </View>

          {listContent}
        </ScrollView>
      </Screen>

      <SearchFloatingActions
        mapActive={false}
        filtersActive={filtersVisible}
        onMapPress={() =>
          router.push({
            pathname: "/search/map",
            params: mapParams
          })
        }
        onFiltersPress={() => setFiltersVisible((current) => !current)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: "relative"
  },
  content: {
    paddingHorizontal: layout.pagePadding,
    paddingBottom: 168
  },
  heroWrap: {
    marginBottom: spacing.sm
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.text,
    shadowOpacity: 0.14,
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
  filtersBlock: {
    marginBottom: spacing.lg
  },
  groupLabel: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  chipRow: {
    gap: spacing.sm,
    paddingBottom: spacing.md
  },
  priceRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  priceField: {
    flex: 1
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  resultsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  resultBlock: {
    paddingBottom: 0
  }
});
