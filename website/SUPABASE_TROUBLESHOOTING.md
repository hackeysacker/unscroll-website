# Supabase Email Submissions Troubleshooting

## Problem: Emails not showing up in Supabase

### Quick Fix (3 steps)

#### Step 1: Run the SQL Setup Script

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `sxgpcsfwbzptlmwfddda`
3. Go to **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy and paste the entire contents of `supabase-setup.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will:
- Create the `email_submissions` table
- Set up proper indexes
- Configure Row Level Security (RLS) policies to allow public inserts

#### Step 2: Verify the Table Was Created

1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. Look for `email_submissions` table
3. You should see columns: `id`, `created_at`, `email`, `name`, `subject`, `message`, `source`

#### Step 3: Test the Form

1. Go to your website
2. Submit a test email
3. Refresh the `email_submissions` table in Supabase
4. Your email should appear!

---

## Common Issues & Solutions

### Issue 1: "Database table not found" Error

**Symptoms:**
- Form submission returns error
- Console shows: "relation 'email_submissions' does not exist"

**Solution:**
Run the SQL setup script (Step 1 above)

---

### Issue 2: "Permission denied" Error

**Symptoms:**
- Form submission returns "Permission denied"
- Console shows: "permission denied for table email_submissions"

**Solution:**
The RLS (Row Level Security) policies are blocking inserts.

**Fix:**
1. Go to Supabase → **Authentication** → **Policies**
2. Find the `email_submissions` table
3. Make sure the policy "Allow anonymous inserts" exists
4. If not, run the SQL setup script again

**Manual fix:**
```sql
-- Enable RLS
ALTER TABLE public.email_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Allow anonymous inserts"
ON public.email_submissions
FOR INSERT
TO anon
WITH CHECK (true);
```

---

### Issue 3: Emails Submitting but Not Visible

**Symptoms:**
- Form says "success"
- No error in console
- But emails don't appear in Supabase Table Editor

**Solution:**
Check the RLS read policy:

1. Go to Supabase → **Table Editor** → `email_submissions`
2. Click **View Policies**
3. Make sure there's a SELECT policy

**Fix:**
```sql
CREATE POLICY "Allow authenticated read access"
ON public.email_submissions
FOR SELECT
TO authenticated
USING (true);
```

Or temporarily disable RLS to check if data is there:
```sql
ALTER TABLE public.email_submissions DISABLE ROW LEVEL SECURITY;
-- Check if you can see data now
-- Don't forget to re-enable it:
ALTER TABLE public.email_submissions ENABLE ROW LEVEL SECURITY;
```

---

### Issue 4: CORS Errors

**Symptoms:**
- Browser console shows CORS error
- Network tab shows request blocked

**Solution:**
This shouldn't happen with Cloudflare Pages, but if it does:

1. In Supabase dashboard: **Settings** → **API**
2. Scroll to **CORS**
3. Add your domain: `https://getunscroll.app`

---

## Debugging Steps

### Check Browser Console

1. Open your website
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Submit the form
5. Look for errors

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Submit the form
4. Look for the request to `/api/waitlist/join`
5. Click on it to see the response

**If response is 200:** Email was saved successfully
**If response is 400:** Email validation failed
**If response is 500:** Database error (check Supabase setup)

### Check Supabase Logs

1. Go to Supabase dashboard
2. Click **Logs** (left sidebar)
3. Select **API Logs**
4. Look for recent POST requests to `email_submissions`
5. Check for errors

---

## Verify Your Setup

Run this query in Supabase SQL Editor to check everything:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'email_submissions'
) as table_exists;

-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'email_submissions';

-- Check policies
SELECT *
FROM pg_policies
WHERE tablename = 'email_submissions';

-- Count submissions
SELECT COUNT(*) as total_submissions
FROM email_submissions;

-- View recent submissions (if any)
SELECT *
FROM email_submissions
ORDER BY created_at DESC
LIMIT 10;
```

---

## Quick Test

To test if everything works, run this in Supabase SQL Editor:

```sql
-- Insert test record
INSERT INTO public.email_submissions (email, subject, message, source)
VALUES ('test@example.com', 'Test', 'Test submission', 'waitlist')
RETURNING *;
```

If this works, your table is set up correctly!

---

## Current Configuration

- **Supabase URL:** `https://sxgpcsfwbzptlmwfddda.supabase.co`
- **Table:** `email_submissions`
- **API Endpoint:** `/api/waitlist/join`
- **Website:** `https://getunscroll.app`

---

## Need More Help?

If none of these solutions work:

1. Check the Cloudflare Pages function logs:
   - Go to Cloudflare Pages dashboard
   - Your project → **Functions** → **Logs**
   - Look for errors when submitting the form

2. Verify the Supabase connection:
   - Make sure the URL and anon key are correct
   - Check if the API key has expired

3. Test the API directly:
   ```bash
   curl -X POST https://getunscroll.app/api/waitlist/join \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","signupSource":"test"}'
   ```

The response should be: `{"ok":true,"referralCode":"..."}`
