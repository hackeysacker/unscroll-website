import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxgpcsfwbzptlmwfddda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z3Bjc2Z3YnpwdGxtd2ZkZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTI0NzYsImV4cCI6MjA3OTMyODQ3Nn0.kkQc632Gu8ozuCD5HoZVS35yGbxA4l2kmuq96bCBg4w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
          goal: string | null;
          is_premium: boolean;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
          goal?: string | null;
          is_premium?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
          goal?: string | null;
          is_premium?: boolean;
          updated_at?: string;
        };
      };
      user_onboarding: {
        Row: {
          user_id: string;
          daily_scroll_hours: number | null;
          primary_distraction_app: string | null;
          worst_scroll_time: string | null;
          improvement_reason: string | null;
          wants_auto_tracking: boolean | null;
          baseline_score: number | null;
          goal_result: string | null;
          daily_training_minutes: number | null;
          personality_type: string | null;
          notifications_accepted: boolean | null;
          screentime_accepted: boolean | null;
          daily_checkin_accepted: boolean | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          daily_scroll_hours?: number | null;
          primary_distraction_app?: string | null;
          worst_scroll_time?: string | null;
          improvement_reason?: string | null;
          wants_auto_tracking?: boolean | null;
          baseline_score?: number | null;
          goal_result?: string | null;
          daily_training_minutes?: number | null;
          personality_type?: string | null;
          notifications_accepted?: boolean | null;
          screentime_accepted?: boolean | null;
          daily_checkin_accepted?: boolean | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          daily_scroll_hours?: number | null;
          primary_distraction_app?: string | null;
          worst_scroll_time?: string | null;
          improvement_reason?: string | null;
          wants_auto_tracking?: boolean | null;
          baseline_score?: number | null;
          goal_result?: string | null;
          daily_training_minutes?: number | null;
          personality_type?: string | null;
          notifications_accepted?: boolean | null;
          screentime_accepted?: boolean | null;
          daily_checkin_accepted?: boolean | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      game_progress: {
        Row: {
          user_id: string;
          level: number;
          xp: number;
          total_xp: number;
          streak: number;
          longest_streak: number;
          last_session_date: string | null;
          streak_freeze_used: boolean;
          total_sessions_completed: number;
          total_challenges_completed: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          level?: number;
          xp?: number;
          total_xp?: number;
          streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          streak_freeze_used?: boolean;
          total_sessions_completed?: number;
          total_challenges_completed?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          level?: number;
          xp?: number;
          total_xp?: number;
          streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          streak_freeze_used?: boolean;
          total_sessions_completed?: number;
          total_challenges_completed?: number;
          updated_at?: string;
        };
      };
      skill_progress: {
        Row: {
          user_id: string;
          focus_score: number;
          impulse_control_score: number;
          distraction_resistance_score: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          focus_score?: number;
          impulse_control_score?: number;
          distraction_resistance_score?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          focus_score?: number;
          impulse_control_score?: number;
          distraction_resistance_score?: number;
          updated_at?: string;
        };
      };
      challenge_results: {
        Row: {
          id: string;
          user_id: string;
          challenge_type: string;
          timestamp: string;
          score: number;
          duration: number;
          xp_earned: number;
          is_perfect: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_type: string;
          timestamp?: string;
          score: number;
          duration: number;
          xp_earned: number;
          is_perfect?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_type?: string;
          timestamp?: string;
          score?: number;
          duration?: number;
          xp_earned?: number;
          is_perfect?: boolean;
          created_at?: string;
        };
      };
      daily_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_xp: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          total_xp?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          total_xp?: number;
          completed?: boolean;
          created_at?: string;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          total_attention_time: number;
          longest_gaze_hold: number;
          focus_accuracy: number;
          impulse_control_score: number;
          stability_rating: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_attention_time?: number;
          longest_gaze_hold?: number;
          focus_accuracy?: number;
          impulse_control_score?: number;
          stability_rating?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          total_attention_time?: number;
          longest_gaze_hold?: number;
          focus_accuracy?: number;
          impulse_control_score?: number;
          stability_rating?: number;
          updated_at?: string;
        };
      };
      heart_state: {
        Row: {
          user_id: string;
          current_hearts: number;
          max_hearts: number;
          last_heart_lost: string | null;
          last_midnight_reset: string | null;
          perfect_streak_count: number;
          total_lost: number;
          total_gained: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_hearts?: number;
          max_hearts?: number;
          last_heart_lost?: string | null;
          last_midnight_reset?: string | null;
          perfect_streak_count?: number;
          total_lost?: number;
          total_gained?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_hearts?: number;
          max_hearts?: number;
          last_heart_lost?: string | null;
          last_midnight_reset?: string | null;
          perfect_streak_count?: number;
          total_lost?: number;
          total_gained?: number;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          unlocked_at: string;
          name: string;
          description: string;
          icon: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          unlocked_at?: string;
          name: string;
          description: string;
          icon: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          unlocked_at?: string;
          name?: string;
          description?: string;
          icon?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          vibration_enabled: boolean;
          sound_enabled: boolean;
          dark_mode: boolean;
          notifications_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          vibration_enabled?: boolean;
          sound_enabled?: boolean;
          dark_mode?: boolean;
          notifications_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          vibration_enabled?: boolean;
          sound_enabled?: boolean;
          dark_mode?: boolean;
          notifications_enabled?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};
