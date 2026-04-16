import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/theme";

interface SearchFloatingActionsProps {
  mapActive: boolean;
  filtersActive: boolean;
  onMapPress: () => void;
  onFiltersPress: () => void;
}

export const SearchFloatingActions = ({
  mapActive,
  filtersActive,
  onMapPress,
  onFiltersPress
}: SearchFloatingActionsProps) => {
  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View style={styles.pill}>
        <Pressable
          onPress={onMapPress}
          style={({ pressed }) => [
            styles.action,
            mapActive ? styles.actionActive : null,
            pressed && styles.pressed
          ]}
        >
          <Ionicons name="map-outline" size={18} color={mapActive ? "#FFFFFF" : colors.primary} />
          <Text style={[styles.label, mapActive ? styles.labelActive : null]}>Map</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          onPress={onFiltersPress}
          style={({ pressed }) => [
            styles.action,
            filtersActive ? styles.actionActive : null,
            pressed && styles.pressed
          ]}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={filtersActive ? "#FFFFFF" : colors.primary}
          />
          <Text style={[styles.label, filtersActive ? styles.labelActive : null]}>Filters</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 95,
    alignItems: "center"
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8
  },
  action: {
    minWidth: 110,
    minHeight: 40,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999
  },
  actionActive: {
    backgroundColor: colors.primary
  },
  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800"
  },
  labelActive: {
    color: "#FFFFFF"
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 2
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  }
});
