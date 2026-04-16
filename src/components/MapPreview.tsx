import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Region } from "react-native-maps";
import { Property } from "../types";
import { colors, radius, spacing } from "../utils/theme";

interface MapPreviewProps {
  property: Property;
}

export const MapPreview = ({ property }: MapPreviewProps) => {
  const region: Region = {
    latitude: property.latitude,
    longitude: property.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Preview</Text>
      <View style={styles.mapWrap}>
      <View style={[styles.map, { backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="map-outline" size={32} color={colors.textSoft} />
        <Text style={{ color: colors.textSoft, marginTop: 8 }}>Map View Placeholder</Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  mapWrap: {
    height: 220,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border
  },
  map: {
    width: "100%",
    height: "100%"
  }
});
