import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { SearchChromeFab } from "../../components/SearchChromeFab";
import { colors } from "../../utils/theme";
import { ListingCategory, Property, PropertyType } from "../../types";
import { mockProperties } from "../../data/mockProperties";
import { formatCompactPrice } from "../../utils/format";

const readString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const readNumber = (value: string | string[] | undefined) => {
  const raw = readString(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalize = (value: string) => value.toLowerCase().trim();

type FilterState = {
  query?: string;
  type?: PropertyType | "All";
  category?: ListingCategory | "All";
  location?: string;
  minPrice?: number;
  maxPrice?: number;
};

const matchesFilters = (property: Property, filters: FilterState) => {
  const query = normalize(filters.query ?? "");
  const location = normalize(filters.location ?? "");

  const typeMatch = !filters.type || filters.type === "All" || property.type === filters.type;
  const categoryMatch =
    !filters.category || filters.category === "All" || property.category === filters.category;
  const minPriceMatch = filters.minPrice === undefined || property.price >= filters.minPrice;
  const maxPriceMatch = filters.maxPrice === undefined || property.price <= filters.maxPrice;
  const queryMatch =
    !query ||
    normalize(property.title).includes(query) ||
    normalize(property.location).includes(query) ||
    normalize(property.city).includes(query);
  const locationMatch =
    !location ||
    normalize(property.location).includes(location) ||
    normalize(property.city).includes(location);

  return typeMatch && categoryMatch && minPriceMatch && maxPriceMatch && queryMatch && locationMatch;
};

export const SearchMapScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    query?: string;
    type?: PropertyType;
    category?: ListingCategory;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  const filters = useMemo(
    () => ({
      query: readString(params.query),
      type: readString(params.type) as PropertyType | undefined,
      category: readString(params.category) as ListingCategory | undefined,
      location: readString(params.location),
      minPrice: readNumber(params.minPrice),
      maxPrice: readNumber(params.maxPrice)
    }),
    [params.category, params.location, params.maxPrice, params.minPrice, params.query, params.type]
  );

  const data = useMemo(
    () => mockProperties.filter((property) => matchesFilters(property, filters)),
    [filters]
  );

  const initialRegion = {
    latitude: data[0]?.latitude ?? 8.99,
    longitude: data[0]?.longitude ?? 38.76,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06
  };

  return (
    <Screen scrollable={false} horizontalPadding={false} contentStyle={styles.screen}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {data.map((property) => (
          <Marker
            key={property.id}
            coordinate={{ latitude: property.latitude, longitude: property.longitude }}
            title={property.title}
            description={property.location}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.priceMarker}>
              <Text style={styles.priceMarkerText}>{formatCompactPrice(property.price)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <SearchChromeFab
        left={{
          label: "List",
          icon: "list-outline",
          onPress: () => router.back()
        }}
        right={{
          label: "Save",
          icon: "bookmark-outline",
          onPress: () => router.push("/favorites")
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  map: {
    flex: 1
  },
  priceMarker: {
    minWidth: 58,
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowColor: colors.text,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5
  },
  priceMarkerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.2
  },
});
