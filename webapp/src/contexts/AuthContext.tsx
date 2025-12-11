import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, GoalType, OnboardingData } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage, clearAllStorage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isOnboarded: boolean;
  login: (email?: string) => void;
  logout: () => void;
  completeOnboarding: (goal: GoalType) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load user from storage on mount, or create new user if none exists
  useEffect(() => {
    const savedUser = loadFromStorage<User>(STORAGE_KEYS.USER);
    if (savedUser) {
      // Ensure all existing users get premium access
      if (!savedUser.isPremium) {
        const upgradedUser = { ...savedUser, isPremium: true };
        setUser(upgradedUser);
        saveToStorage(STORAGE_KEYS.USER, upgradedUser);
      } else {
        setUser(savedUser);
      }
      setIsOnboarded(!!savedUser.goal);
    } else {
      // Auto-create user on first visit with premium access
      const newUser: User = {
        id: crypto.randomUUID(),
        email: undefined,
        createdAt: Date.now(),
        goal: undefined, // will be set during onboarding
        isPremium: true, // All users get premium access
      };
      setUser(newUser);
      saveToStorage(STORAGE_KEYS.USER, newUser);
      setIsOnboarded(false);
    }
  }, []);

  const login = (email?: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: Date.now(),
      goal: undefined, // will be set during onboarding
      isPremium: true, // All users get premium access
    };
    setUser(newUser);
    saveToStorage(STORAGE_KEYS.USER, newUser);
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    clearAllStorage();
  };

  const completeOnboarding = (goal: GoalType) => {
    if (!user) return;

    const updatedUser = { ...user, goal };
    setUser(updatedUser);
    setIsOnboarded(true);
    saveToStorage(STORAGE_KEYS.USER, updatedUser);
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      onboardingData: {
        ...user.onboardingData,
        ...data,
      },
    };
    setUser(updatedUser);
    saveToStorage(STORAGE_KEYS.USER, updatedUser);
  };

  const upgradeToPremium = () => {
    if (!user) return;

    const updatedUser = { ...user, isPremium: true };
    setUser(updatedUser);
    saveToStorage(STORAGE_KEYS.USER, updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOnboarded,
        login,
        logout,
        completeOnboarding,
        updateOnboardingData,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
