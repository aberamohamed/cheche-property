import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFS_STORAGE_KEY = 'relty-preferences';

interface PreferencesState {
  /** The selected theme id: 1 = light, 2 = default, 3 = blue, 4 = black */
  theme: number;
  /** Convenience flag: true when theme === 4 (pure black/OLED) */
  isBlackTheme: boolean;
  setTheme: (id: number) => void;
}

const PreferencesContext = createContext<PreferencesState | undefined>(undefined);

interface PersistedPrefs {
  theme: number;
}

async function loadPrefs(): Promise<PersistedPrefs> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PersistedPrefs;
    }
  } catch {
    // ignore parse errors; fall through to default
  }
  return { theme: 2 }; // default theme
}

async function savePrefs(prefs: PersistedPrefs): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<number>(2);

  useEffect(() => {
    loadPrefs().then((prefs) => {
      setThemeState(prefs.theme);
    });
  }, []);

  const setTheme = useCallback((id: number) => {
    setThemeState(id);
    savePrefs({ theme: id });
  }, []);

  const value: PreferencesState = {
    theme,
    isBlackTheme: theme === 4,
    setTheme,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesState {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within a <PreferencesProvider>');
  }
  return ctx;
}
