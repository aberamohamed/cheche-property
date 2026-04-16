import {
  Text,
  StyleSheet,
  type TextProps,
  type StyleProp,
  TextStyle,
} from "react-native";

// Define the interface for CustomTextProps
interface CustomTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "xs";
  color?: string;
  align?: "left" | "center" | "right"; // ✅ Added `align` prop
  style?: StyleProp<TextStyle>;

  numberOfLines?: number; // ✅ Added `numberOfLines` prop
  translate?: boolean; // ✅ Added `translate` prop
}

const CustomText = ({
  children = "",
  variant = "p",
  color = "#2b1e30",
  align = "left",
  style,
  numberOfLines,
  translate = true, // ✅ Default value for `translate` is `true`
  ...rest
}: CustomTextProps) => {
  const variantStyles = getVariantStyles(variant);

  const translatedText = children;

  return (
    <Text
      style={[styles.base, variantStyles, { color, textAlign: align }, style]}
      numberOfLines={numberOfLines} // ✅ Pass `numberOfLines` to `Text`
      {...rest}
    >
      {translatedText}
    </Text>
  );
};

// Helper function to get styles based on the variant
const getVariantStyles = (
  variant: CustomTextProps["variant"]
): StyleProp<TextStyle> => {
  switch (variant) {
    case "h1":
      return styles.h1;
    case "h2":
      return styles.h2;
    case "h3":
      return styles.h3;
    case "h4":
      return styles.h4;
    case "h5":
      return styles.h5;
    case "xs":
      return styles.xs;
    case "p":
    default:
      return styles.p;
  }
};

// StyleSheet definitions
const styles = StyleSheet.create({
  base: {
    fontFamily: "Poppins_400Regular",
  },
  h1: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
  },
  h2: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  h3: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  h4: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  h5: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  p: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 24,
  },
  xs: {
    color: "#9e9e9e",
    fontSize: 12,
  },
});

export default CustomText;
