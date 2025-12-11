import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppSettings } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: AppSettings | null;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Load settings from storage
  useEffect(() => {
    if (!user) {
      setSettings(null);
      return;
    }

    const savedSettings = loadFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS);
    if (savedSettings && savedSettings.userId === user.id) {
      setSettings(savedSettings);
      // Apply dark mode
      if (savedSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Initialize default settings with dark mode enabled
      const defaultSettings: AppSettings = {
        userId: user.id,
        vibrationEnabled: true,
        soundEnabled: true,
        darkMode: true,
        notificationsEnabled: true,
      };
      setSettings(defaultSettings);
      saveToStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
      // Apply dark mode immediately
      document.documentElement.classList.add('dark');
    }
  }, [user]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    if (!settings) return;

    const updatedSettings = { ...settings, ...updates };
    setSettings(updatedSettings);
    saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);

    // Apply dark mode changes immediately
    if ('darkMode' in updates) {
      if (updates.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleDarkMode = () => {
    if (!settings) return;
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
