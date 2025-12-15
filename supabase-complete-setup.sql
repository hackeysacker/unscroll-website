-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- AI Attention Training App
-- ============================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- This creates all necessary tables for the app

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
-- Extended user information beyond Supabase auth
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,

  -- Stats
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  hearts INTEGER DEFAULT 5,
  gems INTEGER DEFAULT 0,

  -- Settings
  notifications_enabled BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  haptics_enabled BOOLEAN DEFAULT TRUE,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- ============================================
-- 2. WAITLIST TABLE
-- ============================================
-- For website early access signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  signup_source TEXT,
  marketing_source TEXT,
  marketing_campaign TEXT,
  referral_code_used TEXT,
  position INTEGER,
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- 3. CHALLENGES TABLE
-- ============================================
-- Master list of all available challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_type TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  base_xp INTEGER DEFAULT 10,
  max_level INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT challenge_category CHECK (category IN ('focus', 'memory', 'reaction', 'control', 'tracking')),
  CONSTRAINT challenge_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert'))
);

-- ============================================
-- 4. CHALLENGE ATTEMPTS TABLE
-- ============================================
-- Track every challenge attempt by users
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL,
  level INTEGER NOT NULL,
  score INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  is_perfect BOOLEAN DEFAULT FALSE,
  is_passed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER NOT NULL,
  accuracy NUMERIC(5,2),
  reaction_time_ms INTEGER,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT score_range CHECK (score >= 0 AND score <= 100),
  CONSTRAINT accuracy_range CHECK (accuracy IS NULL OR (accuracy >= 0 AND accuracy <= 100))
);

-- ============================================
-- 5. USER PROGRESS TABLE
-- ============================================
-- Track progress for each challenge type
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  highest_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_perfect INTEGER DEFAULT 0,
  total_passed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, challenge_type),
  CONSTRAINT highest_score_range CHECK (highest_score >= 0 AND highest_score <= 100)
);

-- ============================================
-- 6. BADGES TABLE
-- ============================================
-- Unlocked achievements
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier TEXT DEFAULT 'bronze',
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, badge_type),
  CONSTRAINT badge_tier CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- ============================================
-- 7. BADGE PROGRESS TABLE
-- ============================================
-- Progress toward unlocking badges
CREATE TABLE IF NOT EXISTS public.badge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, badge_type),
  CONSTRAINT progress_positive CHECK (current_progress >= 0 AND target_progress > 0)
);

-- ============================================
-- 8. DAILY STATS TABLE
-- ============================================
-- Track daily user activity
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  challenges_completed INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  perfect_challenges INTEGER DEFAULT 0,
  total_practice_time_ms INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,

  UNIQUE(user_id, date),
  CONSTRAINT best_score_range CHECK (best_score >= 0 AND best_score <= 100)
);

-- ============================================
-- 9. LEADERBOARD TABLE
-- ============================================
-- Global and weekly leaderboards
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  rank INTEGER,
  challenges_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, period),
  CONSTRAINT period_type CHECK (period IN ('all_time', 'weekly', 'monthly'))
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON public.user_profiles(current_level);

-- Waitlist indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON public.waitlist(referral_code);

-- Challenge attempts indexes
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user_id ON public.challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_challenge_type ON public.challenge_attempts(challenge_type);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_attempted_at ON public.challenge_attempts(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user_challenge ON public.challenge_attempts(user_id, challenge_type);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge_type ON public.user_progress(challenge_type);

-- Badges indexes
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON public.badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_badge_type ON public.badges(badge_type);

-- Badge progress indexes
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON public.badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_badge_type ON public.badge_progress(badge_type);

-- Daily stats indexes
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON public.daily_stats(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date DESC);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_period_rank ON public.leaderboard(period, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_period ON public.leaderboard(user_id, period);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON public.challenges;

DROP POLICY IF EXISTS "Users can view own attempts" ON public.challenge_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.challenge_attempts;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

DROP POLICY IF EXISTS "Users can view own badges" ON public.badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.badges;

DROP POLICY IF EXISTS "Users can view own badge progress" ON public.badge_progress;
DROP POLICY IF EXISTS "Users can insert own badge progress" ON public.badge_progress;
DROP POLICY IF EXISTS "Users can update own badge progress" ON public.badge_progress;

DROP POLICY IF EXISTS "Users can view own daily stats" ON public.daily_stats;
DROP POLICY IF EXISTS "Users can insert own daily stats" ON public.daily_stats;
DROP POLICY IF EXISTS "Users can update own daily stats" ON public.daily_stats;

DROP POLICY IF EXISTS "Leaderboard viewable by authenticated users" ON public.leaderboard;
DROP POLICY IF EXISTS "Users can update own leaderboard entry" ON public.leaderboard;
DROP POLICY IF EXISTS "Users can insert own leaderboard entry" ON public.leaderboard;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Challenges Policies (public read)
CREATE POLICY "Challenges are viewable by everyone"
ON public.challenges FOR SELECT
USING (true);

-- Challenge Attempts Policies
CREATE POLICY "Users can view own attempts"
ON public.challenge_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
ON public.challenge_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User Progress Policies
CREATE POLICY "Users can view own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Badges Policies
CREATE POLICY "Users can view own badges"
ON public.badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
ON public.badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Badge Progress Policies
CREATE POLICY "Users can view own badge progress"
ON public.badge_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badge progress"
ON public.badge_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own badge progress"
ON public.badge_progress FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Daily Stats Policies
CREATE POLICY "Users can view own daily stats"
ON public.daily_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats"
ON public.daily_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats"
ON public.daily_stats FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Leaderboard Policies (viewable by all authenticated users)
CREATE POLICY "Leaderboard viewable by authenticated users"
ON public.leaderboard FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own leaderboard entry"
ON public.leaderboard FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own leaderboard entry"
ON public.leaderboard FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on user_progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on badge_progress
DROP TRIGGER IF EXISTS update_badge_progress_updated_at ON public.badge_progress;
CREATE TRIGGER update_badge_progress_updated_at
  BEFORE UPDATE ON public.badge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED INITIAL DATA
-- ============================================

-- Insert default challenge types
INSERT INTO public.challenges (challenge_type, name, description, category, difficulty, base_xp, max_level)
VALUES
  ('focus_hold', 'Focus Hold', 'Maintain attention on a single point', 'focus', 'medium', 10, 100),
  ('memory_flash', 'Memory Flash', 'Remember flashed items in sequence', 'memory', 'medium', 15, 100),
  ('tap_only_correct', 'Tap Only Correct', 'Tap only the correct symbols', 'control', 'medium', 12, 100),
  ('breath_pacing', 'Breath Pacing', 'Follow the breathing rhythm', 'focus', 'easy', 8, 100),
  ('stillness_test', 'Stillness Test', 'Remain completely still', 'control', 'hard', 18, 100),
  ('slow_tracking', 'Slow Tracking', 'Track the moving target smoothly', 'tracking', 'medium', 12, 100),
  ('reaction_inhibition', 'Reaction Inhibition', 'Respond only to correct signals', 'control', 'hard', 16, 100),
  ('finger_hold', 'Finger Hold', 'Hold finger steady on screen', 'control', 'easy', 8, 100),
  ('multi_object_tracking', 'Multi Object Tracking', 'Track multiple moving objects', 'tracking', 'hard', 20, 100),
  ('rhythm_tap', 'Rhythm Tap', 'Tap in rhythm with the beat', 'reaction', 'medium', 12, 100),
  ('impulse_spike_test', 'Impulse Spike', 'Maintain focus during distractions', 'focus', 'hard', 18, 100),
  ('gaze_hold', 'Gaze Hold', 'Keep gaze fixed on target', 'focus', 'medium', 10, 100),
  ('moving_target', 'Moving Target', 'Track and tap moving targets', 'tracking', 'medium', 14, 100),
  ('tap_pattern', 'Tap Pattern', 'Remember and replicate tap patterns', 'memory', 'hard', 16, 100),
  ('finger_tracing', 'Finger Tracing', 'Trace paths accurately', 'tracking', 'medium', 12, 100)
ON CONFLICT (challenge_type) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '📊 Created 9 tables with RLS policies';
  RAISE NOTICE '🎯 Seeded 15 challenge types';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Enable authentication in Supabase dashboard';
  RAISE NOTICE '2. Update your app with Supabase URL and anon key';
  RAISE NOTICE '3. Test user signup and challenge tracking';
END $$;
