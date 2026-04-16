/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#E30073";
const tintColorDark = "#E30073";
const primary = "#E30074";
const secondary = "#9D174D";

export const Colors = {
  light: {
    text: "#000000",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#687076",
    grayLabel: "#5d5d5dff",
    hybridGrayLabel: "#393939ff",
    lightGray: "#efefef",
    lightGray2: "#f9f9f9",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: primary,
    secondary: secondary,
    danger: "#E30073",
    gray: "#888",
    superLightGray: "#fafafa",
    successLight: "#4ADE80",
    warning: "#FFC107",
    primaryLight: "#FFE1EF"
  },
  dark: {
    text: "#EEFFEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: primary,
    secondary: secondary,
    danger: "#E30073",
    lightGray: "#d5d5d5",
    gray: "#687076",
    superLightGray: "#fafafa"
  },
  palette: {
    neutral: {
      50: "#ffffff",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#c4c4c4",
      500: "#b3b3b3",
      600: "#a2a2a2",
      700: "#919191",
      800: "#808080",
      900: "#6f6f6f",
      1000: "#5e5e5e"
    },
    primary: {
      50: "#fff0f7",
      100: "#ffe1ef",
      200: "#ffc2df",
      300: "#ff94c7",
      400: "#ff66af",
      500: "#ff3897",
      600: "#ff0a7f",
      700: "#e30074",
      800: "#c4005f",
      900: "#a2004a",
      1000: "#800035"
    }
  },
  primaryTheme: [primary, "#49011fff", "#081023ff", "#020617"] as const,
  // darkTheme: ['#0f172a', '#020617', '#000000'] as const,
  darkTheme: [
    "#C89B2D",
    "#A8823A",
    "#6E6B63",
    "#3B5FB8",
    "#2F4EA1"
  ] as const,
  lightTheme: ["#FFFFFF", "#FFFFFF", "#FFFFFF"] as const,
  //lightTheme: ['#FFFFFF', '#F8FAFC', '#F1F5F9'] as const,
  whiteGradient: ["#FFFFFF", "#FDFDFD", "#F9F9F9"] as const,
  hybridTheme: [primary, "#ff4291ff", "#ffd8ebff", "#ffd8ebff", "#ffffff"] as const,
  hybridTheme2: [primary, "#ff4291ff", "#fe68b1ff", "#ff93c7ff", "#ff93c7ff"] as const,
  //hybridTheme: [primary, "#ae0049ff", "#adaeb1ff", "#ffffffff"] as const
};
