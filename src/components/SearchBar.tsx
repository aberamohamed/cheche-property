import { Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../utils/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by city, title, or keyword",
  style
}: SearchBarProps) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color={colors.textSoft} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText("")} hitSlop={12} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={colors.textSoft} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg + 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 0
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center"
  }
});
