import type { RefObject } from "react";
import type { View } from "react-native";
import { SearchChromeFab } from "./SearchChromeFab";

interface SearchFloatingActionsProps {
  mapActive: boolean;
  filtersActive: boolean;
  onMapPress: () => void;
  onFiltersPress: () => void;
  /** Android: same `BlurTargetView` ref as tab stack / SearchBar for real blur. */
  blurTargetRef?: RefObject<View | null>;
}

export const SearchFloatingActions = ({
  mapActive,
  filtersActive,
  onMapPress,
  onFiltersPress,
  blurTargetRef
}: SearchFloatingActionsProps) => (
  <SearchChromeFab
    blurTargetRef={blurTargetRef}
    left={{
      label: "Map",
      icon: "map-outline",
      onPress: onMapPress,
      active: mapActive
    }}
    right={{
      label: "Filters",
      icon: "options-outline",
      onPress: onFiltersPress,
      active: filtersActive
    }}
  />
);
