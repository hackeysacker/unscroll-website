# Troubleshooting Email Submissions

If the contact form isn't working, follow these steps:

## 1. Check Browser Console

Open the browser developer tools (F12) and check the Console tab for any error messages when submitting the form.

## 2. Verify Database Table Exists

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Look for the `email_submissions` table
4. If it doesn't exist, run the SQL migration from `supabase-migrations/create_email_submissions_table.sql`

## 3. Check Row Level Security (RLS)

1. In Supabase dashboard, go to **Table Editor** → `email_submissions`
2. Click on the **Policies** tab
3. Verify these policies exist:
   - **"Allow anonymous inserts"** - allows INSERT for `anon` role
   - **"Allow authenticated reads"** - allows SELECT for `authenticated` role

If policies are missing:
1. Go to **SQL Editor** in Supabase
2. Run this SQL:

```sql
-- Enable RLS
ALTER TABLE email_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON email_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

## 4. Test Direct Insert

Try inserting a test record directly in Supabase SQL Editor:

```sql
INSERT INTO email_submissions (email, message, source)
VALUES ('test@example.com', 'Test message', 'website');
```

If this fails, there's an issue with the table structure or RLS policies.

## 5. Check Network Tab

1. Open browser developer tools
2. Go to **Network** tab
3. Submit the form
4. Look for a request to `supabase.co`
5. Check if it's successful (status 200/201) or has errors (400/401/403/500)

## Common Errors

### Error: "relation \"email_submissions\" does not exist"
**Solution**: Run the SQL migration file to create the table.

### Error: "new row violates row-level security policy"
**Solution**: The RLS policy for anonymous inserts is missing or incorrect. Check step 3 above.

### Error: "permission denied"
**Solution**: RLS is enabled but policies aren't set correctly. Check step 3 above.

### Error: Network/CORS error
**Solution**: Ensure Supabase URL and anon key are correct in `src/lib/supabase.ts`

## Quick Fix SQL

If you need to quickly reset everything:

```sql
-- Drop table if exists (WARNING: This deletes all data!)
DROP TABLE IF EXISTS email_submissions CASCADE;

-- Then run the full migration from create_email_submissions_table.sql
```



