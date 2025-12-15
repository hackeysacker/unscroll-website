# Supabase Setup Guide

Complete guide to setting up your Supabase database for the AI Attention Training App.

## Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **+ New Query**

## Step 2: Run the Setup Script

1. Open the file `supabase-complete-setup.sql` in this directory
2. **Copy the ENTIRE contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for completion - you should see success messages

## Step 3: Verify Tables Were Created

After running the script, verify your tables:

1. Click **Table Editor** in the left sidebar
2. You should see these 9 tables:
   - ✅ `user_profiles`
   - ✅ `waitlist`
   - ✅ `challenges`
   - ✅ `challenge_attempts`
   - ✅ `user_progress`
   - ✅ `badges`
   - ✅ `badge_progress`
   - ✅ `daily_stats`
   - ✅ `leaderboard`

## Step 4: Verify Challenges Were Seeded

1. Click **Table Editor** → **challenges**
2. You should see 15 challenge types populated
3. If empty, re-run the "SEED INITIAL DATA" section of the SQL

## Step 5: Enable Authentication

1. Click **Authentication** → **Providers** in the left sidebar
2. Enable **Email** provider (should be enabled by default)
3. Optional: Enable social providers (Google, Apple, etc.)

## Step 6: Get Your Supabase Credentials

1. Click **Project Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. Copy these values:
   - **Project URL**: `https://xxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 7: Update Your App Configuration

### For Mobile App

Create or update `.env` file in `mobile/` directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Website

Update `website/lib/supabase.js` with your credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

---

## Database Schema Overview

### Tables and Their Purpose

#### 1. **user_profiles**
Extended user data beyond Supabase auth
- Username, avatar name
- XP, level, streak, hearts, gems
- Settings (notifications, sound, haptics)

#### 2. **waitlist**
Website early access signups
- Email, referral codes
- Marketing source tracking
- Position in queue

#### 3. **challenges**
Master list of all challenge types
- 15 different challenges (focus, memory, reaction, control, tracking)
- Category, difficulty, base XP
- Pre-seeded with data

#### 4. **challenge_attempts**
Track every challenge attempt
- User ID, challenge type, level
- Score, duration, accuracy
- Pass/fail, perfect runs
- XP earned

#### 5. **user_progress**
Progress per challenge type
- Current level per challenge
- Highest score, total attempts
- Perfect runs count

#### 6. **badges**
Unlocked achievements
- Badge type, name, description
- Tier (bronze → diamond)
- Unlock timestamp

#### 7. **badge_progress**
Progress toward badges
- Current progress vs target
- Tracks incremental progress

#### 8. **daily_stats**
Daily activity tracking
- Challenges completed per day
- XP earned, practice time
- Streak tracking

#### 9. **leaderboard**
Global and periodic rankings
- All-time, weekly, monthly
- Total XP, rank, challenges completed

---

## Security (Row Level Security)

All tables have RLS policies that ensure:
- ✅ Users can only access their own data
- ✅ Challenges are public (everyone can read)
- ✅ Leaderboard is viewable by authenticated users
- ✅ No user can modify another user's data

---

## Testing Your Setup

### Test 1: Create a Test User

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Click **Create user**

### Test 2: Insert Test Data

Run this in SQL Editor to test:

```sql
-- Insert a test profile (replace USER_ID with your test user's ID)
INSERT INTO user_profiles (id, username, avatar_name, total_xp, current_level)
VALUES ('YOUR_USER_ID_HERE', 'testuser', 'Focus Master', 100, 5);

-- Verify it was inserted
SELECT * FROM user_profiles;
```

### Test 3: Verify RLS

Try selecting from another user's data - it should return empty:

```sql
-- This should only show YOUR data when logged in
SELECT * FROM challenge_attempts WHERE user_id = auth.uid();
```

---

## Troubleshooting

### Issue: "relation already exists"
**Solution**: Tables already created. You can skip the CREATE TABLE statements or drop and recreate.

### Issue: RLS policies blocking access
**Solution**: Make sure you're authenticated when testing. Use the Supabase dashboard's SQL editor which runs as service_role.

### Issue: Challenges table is empty
**Solution**: Re-run just the seed data section (bottom of setup script).

### Issue: Can't insert data
**Solution**:
1. Check you're authenticated
2. Verify RLS policies are correct
3. Check that user_id matches auth.uid()

---

## Next Steps

1. ✅ Database setup complete
2. 📱 Update mobile app Supabase config
3. 🌐 Update website Supabase config
4. 🧪 Test user signup in mobile app
5. 🎯 Test challenge tracking
6. 🏆 Test badge unlocking
7. 📊 Test leaderboard

---

## Quick Reference: Important Queries

### Get user profile
```sql
SELECT * FROM user_profiles WHERE id = auth.uid();
```

### Get user's challenge progress
```sql
SELECT * FROM user_progress WHERE user_id = auth.uid();
```

### Get user's recent attempts
```sql
SELECT * FROM challenge_attempts
WHERE user_id = auth.uid()
ORDER BY attempted_at DESC
LIMIT 10;
```

### Get leaderboard (all-time)
```sql
SELECT
  l.rank,
  p.username,
  l.total_xp,
  l.challenges_completed
FROM leaderboard l
JOIN user_profiles p ON p.id = l.user_id
WHERE l.period = 'all_time'
ORDER BY l.rank ASC
LIMIT 100;
```

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **SQL Syntax Help**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
