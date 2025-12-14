# Debugging "Network Error" on Form Submission

## What Changed

I've added detailed error logging to help identify the issue. The new code will show:
1. The exact HTTP status code
2. The error message from the API
3. The full error details in the browser console

## How to Debug

### Step 1: Open Browser Console

1. Go to your website: `https://getunscroll.app`
2. Press **F12** (or right-click → Inspect)
3. Click on the **Console** tab
4. Clear any existing messages (trash can icon)

### Step 2: Test the Form

1. Enter an email address
2. Click "Join Early Access"
3. Watch the console for error messages

### Step 3: Check the Error

Look for messages starting with:
- `API Error:` - The API returned an error
- `Response error:` - The response was successful but contained an error
- `Network error:` - The request failed completely

**Copy the full error message** - it will tell us exactly what's wrong!

---

## Common Error Messages & Solutions

### Error: "Failed to fetch" or "NetworkError"

**Cause:** The API endpoint isn't accessible

**Solutions:**
1. Check if the site is deployed: https://getunscroll.app/api/waitlist/join should exist
2. The `nodejs_compat` flag might not be set (see CLOUDFLARE_SETUP.md)
3. The build might have failed

**Fix:**
- Go to Cloudflare Pages → Deployments
- Check if the latest deployment succeeded
- Promote the preview deployment to production

---

### Error: "Database table not found"

**Cause:** The `email_submissions` table doesn't exist in Supabase

**Solution:**
Run the SQL script in `supabase-setup.sql` (see SUPABASE_TROUBLESHOOTING.md Step 1)

---

### Error: "Permission denied"

**Cause:** Supabase Row Level Security is blocking the insert

**Solution:**
1. Go to Supabase dashboard
2. Click **Authentication** → **Policies**
3. Find `email_submissions` table
4. Make sure "Allow anonymous inserts" policy exists
5. If not, run the SQL in `supabase-setup.sql`

---

### Error: "Invalid email format"

**Cause:** The email validation is rejecting your email

**Solution:**
Make sure you're using a valid email format: `name@domain.com`

---

## Advanced Debugging

### Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Submit the form
4. Look for the request to `/api/waitlist/join`
5. Click on it to see:
   - **Request**: What was sent
   - **Response**: What came back
   - **Status**: HTTP status code

**Status Codes:**
- `200 OK` - Success!
- `400 Bad Request` - Invalid email or missing data
- `500 Internal Server Error` - Database or server issue
- `404 Not Found` - API endpoint doesn't exist
- Failed to load - Network connectivity issue

### Test API Directly

Try calling the API from command line:

```bash
curl -X POST https://getunscroll.app/api/waitlist/join \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","signupSource":"test"}'
```

**Expected response:**
```json
{"ok":true,"referralCode":"ABC123"}
```

**Error responses:**
```json
{"ok":false,"error":"Email is required"}
{"ok":false,"error":"Database table not found..."}
{"ok":false,"error":"Permission denied..."}
```

---

## Cloudflare Pages Function Logs

If the API is failing on Cloudflare's side:

1. Go to Cloudflare dashboard
2. Your Pages project → **Functions**
3. Click **Real-time logs**
4. Submit the form on your website
5. Watch for errors in the logs

This will show server-side errors that don't appear in the browser.

---

## Quick Checklist

Before debugging, verify:
- [ ] Deployed to production (not just preview)
- [ ] `nodejs_compat` flag enabled (Settings → Functions → Compatibility Flags)
- [ ] Supabase table created (ran `supabase-setup.sql`)
- [ ] Supabase RLS policies set (allows anonymous inserts)
- [ ] No CORS errors in browser console
- [ ] API endpoint accessible: https://getunscroll.app/api/waitlist/join

---

## What to Share for Help

If you're still stuck, share:
1. The full error message from the browser console
2. The HTTP status code from the Network tab
3. Screenshot of the error (if applicable)
4. Whether the Supabase setup was completed

This will help identify the exact issue!
