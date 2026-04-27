import { spacing } from "./theme";

/** Toolbar row height below the status bar inset (logo + language row). */
const TOOLBAR_ROW_MIN_HEIGHT = 52;

/** Space below the toolbar row inside the header strip. */
const STRIP_PADDING_BOTTOM = spacing.sm;

/**
 * Total height of the full-bleed tab header (status bar inset + toolbar + bottom padding).
 * Use as `paddingTop` on tab scroll content so lists clear the header.
 */
export function tabHeaderFabContentPaddingTop(safeInsetTop: number): number {
  return safeInsetTop + TOOLBAR_ROW_MIN_HEIGHT + STRIP_PADDING_BOTTOM;
}

export const TAB_HEADER_FAB_ROW_MIN_HEIGHT = TOOLBAR_ROW_MIN_HEIGHT;
