import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/theme";

interface FavoriteButtonProps {
  active: boolean;
  onPress?: () => void;
  size?: number;
}

export const FavoriteButton = ({ active, onPress, size = 18 }: FavoriteButtonProps) => (
  <Pressable onPress={onPress} hitSlop={10} style={styles.container}>
    <Ionicons
      name={active ? "heart" : "heart-outline"}
      size={size}
      color={active ? colors.danger : colors.text}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
});
