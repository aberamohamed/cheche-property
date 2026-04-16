import { FlatList, StyleSheet, View } from "react-native";
import { Property } from "../types";
import { SectionHeader } from "./SectionHeader";
import { PropertyCard } from "./PropertyCard";
import { layout, spacing } from "../utils/theme";

interface PropertySectionProps {
  title?: string;
  subtitle?: string;
  properties: Property[];
  favoriteIds?: string[];
  onPressProperty: (property: Property) => void;
  onToggleFavorite: (propertyId: string) => void;
  onSeeAll?: () => void;
}

export const PropertySection = ({
  title,
  subtitle,
  properties,
  favoriteIds = [],
  onPressProperty,
  onToggleFavorite,
  onSeeAll
}: PropertySectionProps) => (
  <View style={styles.container}>
    {title || subtitle || onSeeAll ? (
      <SectionHeader title={title ?? ""} subtitle={subtitle} actionLabel={onSeeAll ? "See all" : undefined} onActionPress={onSeeAll} />
    ) : null}
    <FlatList
      data={properties}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PropertyCard
          property={item}
          compact
          isFavorite={favoriteIds.includes(item.id)}
          onPress={() => onPressProperty(item)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
        />
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl
  },
  list: {
    paddingRight: layout.pagePadding
  }
});
