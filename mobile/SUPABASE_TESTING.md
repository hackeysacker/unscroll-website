# Supabase Integration Testing Checklist

## Setup Steps

1. **Run the schema SQL**
   - Go to Supabase Dashboard > SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Run the entire script

2. **Enable Email Auth**
   - Go to Authentication > Providers
   - Ensure Email is enabled
   - Configure email templates if desired

3. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

## Testing Checklist

### Authentication
- [ ] Sign up with email/password creates user in `auth.users`
- [ ] Sign up triggers `handle_new_user()` function
- [ ] Profile is automatically created in `profiles` table
- [ ] Default rows created in `game_progress`, `skill_progress`, `user_stats`, `heart_state`, `user_settings`, `progress_tree_state`
- [ ] Sign in works with existing credentials
- [ ] Sign out clears session and local storage
- [ ] Session persists across app restarts (AsyncStorage)
- [ ] Offline mode works (falls back to local storage)

### Onboarding
- [ ] `updateOnboardingData()` syncs to `user_onboarding` table
- [ ] All onboarding fields are saved correctly
- [ ] `completeOnboarding()` updates `profiles.goal`
- [ ] `completeOnboarding()` sets `user_onboarding.completed_at`

### Game Progress
- [ ] `initializeProgress()` creates rows in all game tables
- [ ] XP and level updates sync to `game_progress`
- [ ] Streak updates sync correctly
- [ ] `totalChallengesCompleted` increments

### Challenge Results
- [ ] Completing a challenge creates row in `challenge_results`
- [ ] Score, duration, XP are recorded
- [ ] `is_perfect` flag is set for 95+ scores
- [ ] Challenge type is recorded correctly

### Skill Progress
- [ ] Focus score updates sync
- [ ] Impulse control score updates sync
- [ ] Distraction resistance updates sync

### Daily Sessions
- [ ] Session XP totals sync to `daily_sessions`
- [ ] `completed` flag is set when session finishes
- [ ] Date is recorded correctly

### User Stats
- [ ] `totalAttentionTime` increments with each challenge
- [ ] `longestGazeHold` tracks best gaze hold
- [ ] Other stats update appropriately

### Hearts System
- [ ] `current_hearts` syncs when hearts are lost/gained
- [ ] `heart_transactions` logs each change
- [ ] `last_midnight_reset` updates at midnight
- [ ] `perfect_streak_count` tracks consecutive perfects

### Badges
- [ ] Unlocked badges sync to `badges` table
- [ ] Badge progress syncs to `badge_progress`

### Settings
- [ ] Vibration setting syncs
- [ ] Sound setting syncs
- [ ] Dark mode setting syncs
- [ ] Notifications setting syncs

### Themes
- [ ] Selected theme syncs to `user_themes`
- [ ] Theme persists across sessions

### Row Level Security
- [ ] Users can only see their own data
- [ ] Users cannot access other users' records
- [ ] Unauthenticated requests are blocked

## Common Issues

### "relation does not exist" error
- Run the full schema.sql in Supabase SQL Editor

### Auth not working
- Check Supabase URL and anon key in `src/lib/supabase.ts`
- Ensure Email provider is enabled in Authentication settings

### Data not syncing
- Check console for Supabase errors
- Verify RLS policies are in place
- Check that user is authenticated (session exists)

### Offline mode issues
- App should work offline with local storage
- Sync happens when connection is restored

## Verifying Data

### Check user data in Supabase
1. Go to Table Editor
2. Select the table (e.g., `game_progress`)
3. Filter by user_id if needed

### Check auth users
1. Go to Authentication > Users
2. View user details and metadata

### Run queries
```sql
-- Check user's game progress
SELECT * FROM game_progress WHERE user_id = 'user-uuid-here';

-- Check recent challenges
SELECT * FROM challenge_results
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 10;

-- Check heart state
SELECT * FROM heart_state WHERE user_id = 'user-uuid-here';
```

## Performance Notes

- All Supabase syncs are async and don't block UI
- Local storage is the source of truth
- Failed syncs log errors but don't crash the app
- Background sync happens on each state change

## Next Steps

1. Add realtime subscriptions for multi-device sync
2. Implement data migration for existing local users
3. Add offline queue for pending syncs
4. Set up Supabase Edge Functions for server-side logic
