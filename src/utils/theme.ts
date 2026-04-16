import { Colors } from "../constants/Colors";

const light = Colors.light;
const dark = Colors.dark;

export const colors = {
  background: light.background,
  surface: light.background,
  surfaceMuted: light.lightGray2,
  text: light.text,
  textSoft: light.grayLabel,
  border: light.lightGray,
  primary: light.primary,
  primaryDark: light.secondary,
  primarySoft: light.primaryLight,
  primaryLight: light.primaryLight,
  accent: light.warning,
  success: light.successLight,
  danger: light.danger,
  shadow: "rgba(15, 23, 42, 0.08)"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28
};

export const layout = {
  pagePadding: 20,
  cardPadding: 16,
  maxContentWidth: 720
};
