import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../utils/theme";

interface AgentBadgeProps {
  name: string;
  compact?: boolean;
  style?: ViewStyle;
}

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

export const AgentBadge = ({ name, compact = false, style }: AgentBadgeProps) => {
  const initials = getInitials(name);

  return (
    <View style={[styles.container, compact ? styles.containerCompact : null, style]}>
      <View style={[styles.avatar, compact ? styles.avatarCompact : null]}>
        <View style={styles.avatarFallback}>
          <Text style={[styles.avatarText, compact ? styles.avatarTextCompact : null]}>{initials}</Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.name, compact ? styles.nameCompact : null]}>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: colors.text,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    maxWidth: "82%"
  },
  containerCompact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 6
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: colors.primarySoft
  },
  avatarCompact: {
    width: 22,
    height: 22,
    borderRadius: 11
  },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.2
  },
  avatarTextCompact: {
    fontSize: 9
  },
  name: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 11,
    fontWeight: "700"
  },
  nameCompact: {
    fontSize: 10
  }
});
