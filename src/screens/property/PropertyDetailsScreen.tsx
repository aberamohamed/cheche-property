import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/Screen";
import { colors, radius, spacing } from "../../utils/theme";
import { useProperty } from "../../hooks/useProperties";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useAuthStore } from "../../store/authStore";
import { LoadingState } from "../../components/LoadingState";
import { EmptyState } from "../../components/EmptyState";
import { GalleryCarousel } from "../../components/GalleryCarousel";
import { MapPreview } from "../../components/MapPreview";
import { Button } from "../../components/Button";
import { formatCategory, formatCurrency, formatDate } from "../../utils/format";

export const PropertyDetailsScreen = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const params = useLocalSearchParams<{ propertyId?: string; agentName?: string }>();
  const propertyId = typeof params.propertyId === "string" ? params.propertyId : undefined;
  const { data, isLoading, error, refetch } = useProperty(propertyId);
  const showLoading = useMinimumDisplay(isLoading, 3000);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (error) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="Property not available"
          description="That listing might have been removed or the data did not load correctly."
          actionLabel="Try again"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (showLoading || (isLoading && !data)) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Loading property details..." />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen scrollable={false}>
        <EmptyState
          title="Property not available"
          description="That listing might have been removed or the data did not load correctly."
          actionLabel="Try again"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  const isFavorite = favoriteIds.includes(data.id);

  const handleCall = async () => {
    const phone = data.agentPhone.replace(/[^\d+]/g, "");

    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      Alert.alert("Call agent", data.agentPhone);
    }
  };

  const handleChat = () => {
    router.push({
      pathname: "/chat/[propertyId]",
      params: { propertyId: data.id, propertyName: data.title }
    });
  };

  const displayAgentName =
    (typeof params.agentName === "string" && params.agentName.trim()) ||
    data.agentName ||
    (data as unknown as { owner?: { name?: string } }).owner?.name ||
    "Agent";

  return (
    <Screen horizontalPadding={false}>
      <View style={styles.galleryContainer}>
        <GalleryCarousel images={data.images} agentName={displayAgentName} />
        <Pressable style={styles.favoritePill} onPress={() => toggleFavorite(data.id)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? colors.primary : colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.detailsContainer}>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{formatCategory(data.category)}</Text>
          </View>
          <Text style={styles.published}>Listed {formatDate(data.createdAt)}</Text>
        </View>

        <Text style={styles.price}>{formatCurrency(data.price)}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.location}>
          {data.location}, {data.city}
        </Text>

        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Text style={styles.featureValue}>{data.bedrooms}</Text>
            <Text style={styles.featureLabel}>Bedrooms</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureValue}>{data.bathrooms}</Text>
            <Text style={styles.featureLabel}>Bathrooms</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureValue}>{data.area}</Text>
            <Text style={styles.featureLabel}>m²</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent</Text>
          <View style={styles.agentCard}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>{getInitials(displayAgentName)}</Text>
            </View>
            <View style={styles.agentCopy}>
              <Text style={styles.agentName}>{displayAgentName}</Text>
              <Text style={styles.agentPhone}>{data.agentPhone}</Text>
            </View>
          </View>
        </View>

        <MapPreview property={data} />

        <View style={styles.actions}>
          <View style={styles.contactRow}>
            <Pressable style={[styles.contactButton, styles.callButton]} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.contactButtonLabel}>Call</Text>
            </Pressable>
            <Pressable style={[styles.contactButton, styles.chatButton]} onPress={handleChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.contactButtonLabel}>Chat</Text>
            </Pressable>
          </View>
          <View style={styles.spacer} />
          <Button
            title={isFavorite ? "Remove from favorites" : "Save to favorites"}
            variant="secondary"
            onPress={() => toggleFavorite(data.id)}
          />
          <View style={styles.spacer} />
          <Button
            title="Edit listing"
            variant="ghost"
            onPress={() => router.push(`/listing/${data.id}`)}
          />
        </View>
      </View>
    </Screen>
  );
};

const getInitials = (value: string) => {
  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "AG";
};

const styles = StyleSheet.create({
  galleryContainer: {
    marginTop: spacing.xl,
    position: "relative"
  },
  detailsContainer: {
    paddingHorizontal: 20
  },
  favoritePill: {
    position: "absolute",
    top: 14,
    right: 34,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6
  },
  metaRow: {
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primarySoft
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  published: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "600"
  },
  price: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: "900"
  },
  title: {
    marginTop: 4,
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 32
  },
  location: {
    marginTop: 6,
    color: colors.textSoft,
    fontSize: 15,
    fontWeight: "600"
  },
  featureRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm
  },
  feature: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center"
  },
  featureValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  featureLabel: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "600"
  },
  section: {
    marginTop: spacing.xl
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  description: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 23
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  agentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  agentAvatarText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900"
  },
  agentCopy: {
    marginLeft: spacing.md
  },
  agentName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  agentPhone: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600"
  },
  actions: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl
  },
  contactRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  contactButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  callButton: {
    backgroundColor: colors.primarySoft
  },
  chatButton: {
    backgroundColor: colors.surface
  },
  contactButtonLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  spacer: {
    height: spacing.sm
  }
});
