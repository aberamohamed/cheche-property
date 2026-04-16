import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Property } from "../types";
import { colors, radius, spacing } from "../utils/theme";
import { compactLocation, formatCategory, formatCurrency } from "../utils/format";
import { FavoriteButton } from "./FavoriteButton";
import { AgentBadge } from "./AgentBadge";
import { Colors } from "src/constants/Colors";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  compact?: boolean;
}

export const PropertyCard = ({
  property,
  isFavorite = false,
  onPress,
  onToggleFavorite,
  compact = false
}: PropertyCardProps) => {
  const router = useRouter();
  const image = property.images[0];
  const termLabel = property.category === "rent" ? "Yearly" : "Sale";

  const handleCall = () => {
    const phone = property.agentPhone.replace(/[^\d+]/g, "");

    Alert.alert("Call agent", `Call ${property.agentName} at ${property.agentPhone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: async () => {
          await Linking.openURL(`tel:${phone}`);
        }
      }
    ]);
  };

  const handleChat = () => {
    router.push({
      pathname: "/chat/[propertyId]",
      params: { propertyId: property.id, propertyName: property.title }
    });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact ? styles.compactCard : null, pressed && styles.pressed]}
    >
      <View style={[styles.imageWrap, compact ? styles.compactImageWrap : null]}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{formatCategory(property.category)}</Text>
          </View>
          <View style={styles.favorite}>
            <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
          </View>
        </View>
        <AgentBadge
          name={property.agentName}
          compact
          style={styles.agentBadge}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, compact ? styles.priceCompact : null]}>{formatCurrency(property.price)}</Text>
          <Text style={[styles.term, compact ? styles.termCompact : null]}>{termLabel}</Text>
        </View>

        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Ionicons name="bed-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.specText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="water-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.specText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="square-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.specText}>{property.area} m²</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.title}>
          {property.title}
        </Text>

        <Text numberOfLines={1} style={styles.location}>
          {compactLocation(property.location, property.city)}
        </Text>

        {!compact ? (
          <View style={styles.footerActions}>
            <Pressable style={[styles.footerButton, styles.callButton]} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.footerButtonText}>Call</Text>
            </Pressable>

            <Pressable style={[styles.footerButton, styles.saveButton]} onPress={onToggleFavorite}>
              <Ionicons
                name={isFavorite ? "bookmark" : "bookmark-outline"}
                size={18}
                color={colors.primaryDark}
              />
              <Text style={styles.footerButtonText}>{isFavorite ? "Saved" : "Save"}</Text>
            </Pressable>

            <Pressable style={[styles.footerButton, styles.chatButton]} onPress={handleChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.footerButtonText}>Chat</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderColor: "rgba(230, 230, 230, 1)",
    borderWidth: 1,
    marginBottom: spacing.lg,
    width: "100%"
  },
  compactCard: {
    width: 280,
    marginRight: spacing.md
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  },
  imageWrap: {
    height: 220,
    backgroundColor: colors.surfaceMuted
  },
  compactImageWrap: {
    height: 190
  },
  image: {
    width: "100%",
    height: "100%"
  },
  topRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.7)"
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  favorite: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  agentBadge: {
    position: "absolute",
    left: 12,
    bottom: 12
  },
  body: {
    padding: spacing.lg
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  price: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  priceCompact: {
    fontSize: 18
  },
  term: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "700"
  },
  termCompact: {
    fontSize: 11
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: spacing.sm
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  specText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700"
  },
  title: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800"
  },
  location: {
    marginTop: 6,
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "500"
  },
  footerActions: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: 8
  },
  footerButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10
  },
  callButton: {
    backgroundColor: Colors.palette.primary[50]
  },
  saveButton: {
    backgroundColor: Colors.palette.primary[50]
  },
  chatButton: {
    backgroundColor: Colors.palette.primary[50]
  },
  footerButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  }
});
