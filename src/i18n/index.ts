import { useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

/**
 * Supported locale keys that match tabConfig label keys.
 */
export type LocaleKey = 'en' | 'am' | 'om' | 'som' | 'tig';

const SUPPORTED_LOCALES: LocaleKey[] = ['en', 'am', 'om', 'som', 'tig'];

/**
 * Derives the best matching supported locale from the device locale string.
 * Falls back to 'en'.
 */
function resolveLocale(): LocaleKey {
  let deviceLocale: string = 'en';

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings;
    const appleLocale: string | undefined =
      settings?.AppleLocale || settings?.AppleLanguages?.[0];
    if (appleLocale) {
      deviceLocale = appleLocale;
    }
  } else {
    const locale: string | undefined =
      NativeModules.I18nManager?.localeIdentifier;
    if (locale) {
      deviceLocale = locale;
    }
  }

  const lang = deviceLocale.split(/[-_]/)[0].toLowerCase() as LocaleKey;
  return SUPPORTED_LOCALES.includes(lang) ? lang : 'en';
}

let currentLocale: LocaleKey = resolveLocale();
const listeners = new Set<() => void>();

/** Programmatically change the active locale (e.g., from a settings screen). */
export function setLocale(locale: LocaleKey): void {
  currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  listeners.forEach((fn) => fn());
}

/** Returns the current locale key and re-renders the component when it changes. */
export function useLanguageChange(): LocaleKey {
  const [locale, setLocaleState] = useState<LocaleKey>(currentLocale);

  useEffect(() => {
    const update = () => setLocaleState(currentLocale);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return locale;
}

export default { useLanguageChange, setLocale };
