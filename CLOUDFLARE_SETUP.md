# Cloudflare Pages Setup - Enable nodejs_compat Flag

## Quick Method (30 seconds)

1. Visit: https://dash.cloudflare.com/
2. Select your Pages project (unscroll-website)
3. Click **Settings** → **Functions**
4. Scroll to **Compatibility Flags**
5. Add `nodejs_compat` to **both Production and Preview**
6. Click **Save**
7. Done! Your site will work immediately.

---

## Alternative: Wrangler CLI Method

If you prefer using the command line:

### Step 1: Install and Login to Wrangler

```bash
npm install -g wrangler
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### Step 2: Deploy with Wrangler

After the build completes on Cloudflare Pages, the compatibility flag from `website/wrangler.toml` should be automatically applied to Functions.

However, note that Cloudflare Pages doesn't fully support wrangler.toml for compatibility flags, so the manual dashboard method is more reliable.

---

## Why This Is Required

Next.js applications built with `@cloudflare/next-on-pages` use Node.js APIs that require the `nodejs_compat` compatibility flag. Without it, you'll see:

```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

This is a one-time configuration that persists across all deployments.

---

## Verification

After enabling the flag:
1. Visit your deployed site URL
2. You should see your homepage instead of the error
3. The mobile-optimized design should be visible
4. Email capture should work

---

## Current Status

✅ Repository configured correctly
✅ Build succeeds on Cloudflare Pages
✅ Code deployed successfully
⏳ Waiting for compatibility flag to be enabled (manual step)

Once you enable `nodejs_compat`, everything will work!
