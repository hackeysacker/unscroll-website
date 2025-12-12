import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeType, UserTheme } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  availableThemes: ThemeType[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ALL_THEMES: ThemeType[] = [
  'noir-cinema',
  'tokyo-neon',
  'aura-glass',
  'paper-craft',
  'arctic-aurora',
  'rose-quartz',
  'matcha-zen',
  'cosmic-void',
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeType>('noir-cinema');
  const [availableThemes, setAvailableThemes] = useState<ThemeType[]>(['noir-cinema']);

  useEffect(() => {
    if (!user) return;

    const savedTheme = loadFromStorage<UserTheme>(STORAGE_KEYS.USER_THEME);

    if (savedTheme && savedTheme.userId === user.id) {
      setThemeState(savedTheme.selectedTheme);
      setAvailableThemes(savedTheme.unlocked);
    } else {
      // Create default theme settings
      const defaultTheme: UserTheme = {
        userId: user.id,
        selectedTheme: 'noir-cinema',
        unlocked: user.isPremium ? ALL_THEMES : ['noir-cinema'],
      };
      saveToStorage(STORAGE_KEYS.USER_THEME, defaultTheme);
      setThemeState(defaultTheme.selectedTheme);
      setAvailableThemes(defaultTheme.unlocked);
    }

    // Update theme when premium status changes
    if (user.isPremium) {
      const currentTheme = loadFromStorage<UserTheme>(STORAGE_KEYS.USER_THEME);
      if (currentTheme && currentTheme.unlocked.length < ALL_THEMES.length) {
        const updatedTheme: UserTheme = {
          ...currentTheme,
          unlocked: ALL_THEMES,
        };
        saveToStorage(STORAGE_KEYS.USER_THEME, updatedTheme);
        setAvailableThemes(ALL_THEMES);
      }
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    ALL_THEMES.forEach(t => root.classList.remove(`theme-${t}`));

    // Add current theme class
    root.classList.add(`theme-${theme}`);

    // Apply dark mode for dark themes
    const darkThemes: ThemeType[] = ['noir-cinema', 'tokyo-neon', 'arctic-aurora', 'rose-quartz', 'matcha-zen', 'cosmic-void'];
    if (darkThemes.includes(theme)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    if (!user) return;
    if (!availableThemes.includes(newTheme)) return;

    setThemeState(newTheme);

    const currentTheme = loadFromStorage<UserTheme>(STORAGE_KEYS.USER_THEME);
    if (currentTheme) {
      const updatedTheme: UserTheme = {
        ...currentTheme,
        selectedTheme: newTheme,
      };
      saveToStorage(STORAGE_KEYS.USER_THEME, updatedTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
