import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../components/Screen";
import { Colors } from "../../constants/Colors";
import { colors, radius, spacing } from "../../utils/theme";
import { tabHeaderFabContentPaddingTop } from "../../utils/tabHeaderFab";
import { useAuthStore } from "../../store/authStore";
import { useFavoritesStore } from "../../store/favoritesStore";
import { useProperties } from "../../hooks/useProperties";
import { formatCurrency } from "../../utils/format";
import { AgentBadge } from "../../components/AgentBadge";

export const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const favoriteCount = useFavoritesStore((state) => state.ids.length);
  const { data } = useProperties();

  const listingCount = data?.length ?? 0;
  const featuredCount = data?.filter((item) => item.featured).length ?? 0;
  const recentListings = [...(data ?? [])].slice(0, 4);
  const featuredListing = data?.find((item) => item.featured) ?? data?.[0];
  const initials = (user?.name ?? "Abera Mohamed")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AM";

  const handleLogout = () => {
    Alert.alert("Sign out", "Do you want to sign out of Relty?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        }
      }
    ]);
  };

  return (
    <Screen horizontalPadding={false}>
      <View style={[styles.page, { paddingTop: tabHeaderFabContentPaddingTop(insets.top) }]}>
        <View style={styles.heroCard}>
          <View style={styles.avatarShell}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatar}>
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{initials}</Text>
              </View>
            </View>
            {/* <Pressable style={styles.avatarEdit} onPress={() => router.push("/listing/new")}>
              <Ionicons name="pencil" size={14} color={colors.text} />
            </Pressable> */}
          </View>

          <Text style={styles.name}>
            {user?.name ?? "Abera Mohamed"} <Text style={styles.verified}>✓</Text>
          </Text>
          <Text style={styles.email}>{user?.phone ?? user?.email ?? "[PHONE_NUMBER]"}</Text>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.statIconGreen]}>
                <Ionicons name="home-outline" size={16} color={colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.statLabel}>Listings</Text>
                <Text style={styles.statValue}>{listingCount}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.statIconGold]}>
                <Ionicons name="star" size={16} color="#D39B1F" />
              </View>
              <View>
                <Text style={styles.statLabel}>Featured</Text>
                <Text style={styles.statValue}>{featuredCount}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.statIconTeal]}>
                <Ionicons name="heart" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.statLabel}>Saved</Text>
                <Text style={styles.statValue}>{favoriteCount}</Text>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={[
              Colors.palette.primary[700],
              Colors.palette.primary[800],
              Colors.palette.primary[900]
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryCta}
          >
            <Pressable style={styles.primaryCtaPressable} onPress={() => router.push("/listing/new")}>
              <View style={styles.primaryCtaIcon}>
                <Ionicons name="add" size={16} color={colors.primaryDark} />
              </View>
              <Text style={styles.primaryCtaText}>Create Listing</Text>
            </Pressable>
          </LinearGradient>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <Ionicons name="ellipsis-horizontal" size={16} color={colors.textSoft} />
          </View>
          <FlatList
            data={recentListings}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listRow}
            renderItem={({ item }) => (
              <Pressable
                style={styles.listingCard}
                onPress={() =>
                  router.push({
                    pathname: "/property/[propertyId]",
                    params: { propertyId: item.id, agentName: item.agentName }
                  })
                }
              >
                <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
                <AgentBadge
                  name={item.agentName}
                  compact
                  style={styles.listingAgentBadge}
                />
                <View style={styles.listingBody}>
                  <View style={styles.listingTop}>
                    <Text numberOfLines={1} style={styles.listingTitle}>
                      {item.title}
                    </Text>
                    {item.featured ? (
                      <View style={styles.checkPill}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.listingPrice}>{formatCurrency(item.price)}</Text>
                  <Text numberOfLines={1} style={styles.listingMeta}>
                    {item.bedrooms} Beds · {item.bathrooms} Baths · {item.area} m²
                  </Text>
                  <View style={styles.listingBadges}>
                    <View style={styles.badge}>
                      <Ionicons name="home-outline" size={14} color={colors.text} />
                      <Text style={styles.badgeText}>{item.bedrooms}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Ionicons name="bed-outline" size={14} color={colors.text} />
                      <Text style={styles.badgeText}>{item.bathrooms}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Ionicons name="person-outline" size={16} color={colors.textSoft} />
          </View>
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="person-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Security & Password</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => router.push("/favorites")}>
            <View style={styles.actionIcon}>
              <Ionicons name="heart-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>My Favorites</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <Ionicons name="options-outline" size={16} color={colors.textSoft} />
          </View>
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="notifications-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="language-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Language</Text>
            <Text style={styles.actionValue}>English</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="moon-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Dark Mode</Text>
            <Text style={styles.actionValue}>Off</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support & Legal</Text>
            <Ionicons name="information-circle-outline" size={16} color={colors.textSoft} />
          </View>
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="help-buoy-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="document-text-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={() => { }}>
            <View style={styles.actionIcon}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App</Text>
            <Ionicons name="phone-portrait-outline" size={16} color={colors.textSoft} />
          </View>
          <Pressable style={styles.actionRow} onPress={() => router.push("/search")}>
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.actionText}>Search listings</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable style={styles.actionRow} onPress={handleLogout}>
            <View style={styles.actionIcon}>
              <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            </View>
            <Text style={[styles.actionText, { color: "#EF4444" }]}>Sign out</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Pressable>
        </View>

        {/* {featuredListing ? (
          <View style={styles.featuredCard}>
            <Image source={{ uri: featuredListing.images[0] }} style={styles.featuredImage} />
            <AgentBadge
              name={featuredListing.agentName}
              compact
              style={styles.featuredAgentBadge}
            />
            <View style={styles.featuredOverlay}>
              <Text style={styles.featuredTitle} numberOfLines={1}>
                {featuredListing.title}
              </Text>
              <Text style={styles.featuredPrice}>{formatCurrency(featuredListing.price)}</Text>
              <Text style={styles.featuredMeta}>
                {featuredListing.bedrooms} bd · {featuredListing.bathrooms} ba · {featuredListing.area} m²
              </Text>
            </View>
            <View style={styles.featuredBadge}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
          </View>
        ) : null} */}

      </View>
    </Screen >
  );
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 50
  },
  heroCard: {
    marginHorizontal: spacing.lg,
    paddingTop: 42,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(229, 229, 229, 0.91)",
  },
  avatarShell: {
    position: "absolute",
    top: -40,
    alignSelf: "center",
    width: 124,
    height: 124
  },
  avatarGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: 62,
    backgroundColor: "rgba(239, 239, 239, 0.49)"
  },
  avatar: {
    position: "absolute",
    inset: 7,
    borderRadius: 57,
    backgroundColor: "#F9D9E7",
    borderWidth: 6,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarFallback: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE5EF"
  },
  avatarFallbackText: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.5
  },
  avatarEdit: {
    position: "absolute",
    right: 0,
    bottom: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(229, 229, 229, 0.91)",
  },
  name: {
    marginTop: 38,
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center"
  },
  verified: {
    color: colors.primary,
    fontSize: 20
  },
  email: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center"
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(229, 229, 229, 0.91)",
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: "#E7EBF1",
    marginHorizontal: 5
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  statIconGreen: {
    backgroundColor: colors.primarySoft
  },
  statIconGold: {
    backgroundColor: "#FFF5DF"
  },
  statIconTeal: {
    backgroundColor: colors.primarySoft
  },
  statLabel: {
    color: "#5F6675",
    fontSize: 12,
    fontWeight: "500"
  },
  statValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  primaryCta: {
    marginTop: spacing.lg,
    borderRadius: 20,
    overflow: "hidden"
  },
  primaryCtaPressable: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  primaryCtaIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  sectionCard: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(229, 229, 229, 0.91)",
    marginBottom: spacing.sm + 10
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800"
  },
  listRow: {
    paddingRight: spacing.md,
    gap: spacing.sm
  },
  listingCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EDF1F5"
  },
  listingImage: {
    width: "100%",
    height: 160
  },
  listingAgentBadge: {
    position: "absolute",
    top: 12,
    left: 12
  },
  listingBody: {
    padding: spacing.md
  },
  listingTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  listingTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22
  },
  checkPill: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  listingPrice: {
    marginTop: 8,
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "500"
  },
  listingMeta: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500"
  },
  listingBadges: {
    marginTop: spacing.sm,
    flexDirection: "row",
    gap: 6
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F4F4F1"
  },
  badgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700"
  },
  actionRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: "#EEF2F6"
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md
  },
  actionText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "600"
  },
  actionValue: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4
  },
  actionSpacer: {
    height: 6
  },
  featuredCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  featuredImage: {
    width: "100%",
    height: 150
  },
  featuredAgentBadge: {
    position: "absolute",
    top: 12,
    left: 12
  },
  featuredOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.88)"
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  featuredPrice: {
    marginTop: 6,
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "700"
  },
  featuredMeta: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "500"
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
});
