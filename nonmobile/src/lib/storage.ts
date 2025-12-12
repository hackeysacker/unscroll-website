// LocalStorage utilities for data persistence

const STORAGE_KEYS = {
  USER: 'focusflow_user',
  GAME_PROGRESS: 'focusflow_game_progress',
  CHALLENGE_RESULTS: 'focusflow_challenge_results',
  DAILY_SESSIONS: 'focusflow_daily_sessions',
  SKILL_TREE: 'focusflow_skill_tree',
  USER_STATS: 'focusflow_user_stats',
  SETTINGS: 'focusflow_settings',
  BASELINE_TEST: 'focusflow_baseline_test',
  NOTIFICATIONS: 'focusflow_notifications',
  PROGRESS_TREE: 'focusflow_progress_tree',
  TRAINING_PLAN: 'focusflow_training_plan',
  DEEP_ANALYTICS: 'focusflow_deep_analytics',
  WIND_DOWN_SESSIONS: 'focusflow_wind_down_sessions',
  WIND_DOWN_SETTINGS: 'focusflow_wind_down_settings',
  USER_THEME: 'focusflow_user_theme',
  HEART_STATE: 'focusflow_heart_state',
  HEART_TRANSACTIONS: 'focusflow_heart_transactions',
  BADGE_PROGRESS: 'focusflow_badge_progress',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
}

export function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

export { STORAGE_KEYS };
