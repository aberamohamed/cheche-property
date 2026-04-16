import { Platform } from 'react-native';

/**
 * Checks if the current device/OS version supports native glass (LiquidGlassView / advanced BlurView).
 * Currently, requires iOS with version 26 or above. Android is not supported.
 */
export const isPlatformGlassSupported = (): boolean => {
  if (Platform.OS === 'ios') {
    const versionMatch = String(Platform.Version).match(/^(\d+)/);
    if (versionMatch) {
      const majorVersion = parseInt(versionMatch[1], 10);
      return majorVersion >= 26;
    }
  }
  return false;
};
