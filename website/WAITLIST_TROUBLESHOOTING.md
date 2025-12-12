# Waitlist Form Troubleshooting Guide

## Issue: Waitlist form not saving to Supabase

### Steps to Fix:

1. **Verify SQL Migration is Run**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration file: `webapp/supabase-migrations/create_email_submissions_table.sql`
   - Verify the table exists: Go to Table Editor → `email_submissions`

2. **Check Row Level Security (RLS) Policies**
   - Go to Supabase Dashboard → Authentication → Policies
   - Select the `email_submissions` table
   - Verify these policies exist:
     - "Allow anonymous inserts" - FOR INSERT TO anon
     - "Allow public inserts" - FOR INSERT TO public
     - "Allow service role inserts" - FOR INSERT TO service_role

3. **Test the API Route Directly**
   - Open browser DevTools → Network tab
   - Submit the waitlist form
   - Check the `/api/waitlist/join` request:
     - Status code (should be 200)
     - Response body (check for error messages)
     - Request payload (verify email is being sent)

4. **Check Console Logs**
   - Server-side logs (if running locally, check terminal)
   - Client-side logs (browser console)
   - Look for Supabase errors or network errors

5. **Verify Supabase Credentials**
   - Check `website/lib/supabase.js` has correct:
     - `supabaseUrl`: Should be `https://sxgpcsfwbzptlmwfddda.supabase.co`
     - `supabaseAnonKey`: Should match your Supabase project's anon key

6. **Test Direct Supabase Insert**
   - Go to Supabase Dashboard → SQL Editor
   - Run this query to test:
     ```sql
     INSERT INTO email_submissions (email, subject, message, source)
     VALUES ('test@example.com', 'Test', 'Test message', 'waitlist');
     ```
   - If this fails, there's an issue with RLS policies
   - If this succeeds, the issue is with the API route

### Common Error Messages:

- **"Database table not found"**: Run the SQL migration
- **"Permission denied"**: Check RLS policies (step 2 above)
- **"Network error"**: Check if API route is accessible
- **"Invalid email format"**: Email validation issue

### Testing Locally:

1. Run the Next.js dev server:
   ```bash
   cd website
   npm run dev
   ```

2. Navigate to `http://localhost:3000/early`

3. Submit a test email

4. Check Supabase Dashboard → Table Editor → `email_submissions` for the new entry

### Edge Runtime Compatibility:

The API route uses Edge runtime for Cloudflare Pages compatibility. The code uses direct fetch calls to Supabase REST API instead of the Supabase client library, which should work correctly.

If you encounter issues, you can switch to Node.js runtime by removing `export const runtime = 'edge';` from `website/app/api/waitlist/join/route.js`.



