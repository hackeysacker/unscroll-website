# Connect Custom Domain to Cloudflare Pages

## Quick Setup (5 minutes)

### Step 1: Add Custom Domain in Cloudflare Pages

1. Go to your Cloudflare Pages project dashboard
2. Click on your project (unscroll-website)
3. Go to **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter your domain name (e.g., `unscroll.app` or `www.unscroll.app`)
6. Click **Continue**

### Step 2: Configure DNS

Cloudflare will provide you with DNS records to add. You have two scenarios:

#### Scenario A: Domain is Already on Cloudflare

If your domain is already managed by Cloudflare (DNS is on Cloudflare):

1. Cloudflare will **automatically add the DNS records** for you
2. Click **Activate domain**
3. Done! It will be live in a few minutes.

#### Scenario B: Domain is on Another Registrar

If your domain is registered elsewhere (GoDaddy, Namecheap, etc.):

**Option 1: Transfer DNS to Cloudflare (Recommended)**
1. In Cloudflare dashboard, go to **Websites** → **Add a site**
2. Enter your domain name
3. Choose the Free plan
4. Cloudflare will scan your existing DNS records
5. Click **Continue**
6. Cloudflare will give you **nameservers** (e.g., `kai.ns.cloudflare.com`)
7. Go to your domain registrar (GoDaddy, Namecheap, etc.)
8. Find "DNS Settings" or "Nameservers"
9. Change nameservers to Cloudflare's nameservers
10. Wait 24-48 hours for DNS propagation
11. Return to Cloudflare Pages and add your custom domain

**Option 2: Add CNAME Record at Your Registrar**
1. Cloudflare Pages will show you a CNAME record like:
   ```
   Type: CNAME
   Name: www (or @)
   Value: unscroll-website.pages.dev
   ```
2. Go to your domain registrar's DNS settings
3. Add the CNAME record exactly as shown
4. Save changes
5. Wait 5-60 minutes for DNS propagation

### Step 3: Verify Domain

1. Back in Cloudflare Pages, click **Check DNS configuration**
2. Once verified, your site will be live on your custom domain
3. Cloudflare automatically provisions an SSL certificate

---

## Common Domain Configurations

### Root Domain (example.com)

To use your root domain without `www`:

1. If domain is on Cloudflare:
   - Add `example.com` as custom domain
   - Cloudflare creates an `A` record automatically

2. If domain is elsewhere:
   - You need to use **CNAME flattening** or an `A` record
   - Contact your registrar for instructions

### Subdomain (www.example.com)

1. Add `www.example.com` as custom domain
2. Cloudflare creates CNAME: `www` → `your-project.pages.dev`

### Both Root and WWW

1. Add both domains in Cloudflare Pages:
   - `example.com`
   - `www.example.com`
2. Set one as primary (usually `www` or non-www)
3. Cloudflare will redirect the other to primary

---

## Troubleshooting

### "Domain not resolving"
- Wait 5-60 minutes after adding DNS records
- Use `nslookup yourdomain.com` to check DNS propagation
- Clear browser cache

### "SSL Certificate Error"
- Cloudflare auto-provisions SSL certificates
- Wait 10-15 minutes after domain verification
- Ensure SSL/TLS mode is set to "Full" or "Flexible"

### "Too many redirects"
- In Cloudflare dashboard: SSL/TLS → Overview
- Change to **Full** (not Flexible)

### "Domain already in use"
- Remove domain from other Cloudflare services first
- Go to Websites → DNS → Remove conflicting records

---

## Step-by-Step Example

Let's say your domain is `unscroll.app` and it's on Namecheap:

1. **Add domain in Cloudflare Pages:**
   - Go to your Pages project
   - Custom domains → Set up a custom domain
   - Enter: `unscroll.app` and `www.unscroll.app`

2. **Transfer to Cloudflare (recommended):**
   - Cloudflare → Add site → Enter `unscroll.app`
   - Follow Cloudflare's instructions
   - Get nameservers: `kai.ns.cloudflare.com`, `liv.ns.cloudflare.com`
   - Log into Namecheap
   - Domain List → Manage → Domain → Nameservers
   - Select "Custom DNS"
   - Add Cloudflare's nameservers
   - Save and wait 24 hours

3. **Verify:**
   - Return to Cloudflare Pages
   - Check DNS configuration
   - Once verified, your site is live!

---

## What You Need

- Your domain name (purchased from any registrar)
- Access to your domain's DNS settings
- 5-60 minutes for DNS propagation

---

## Current Status

✅ Website deployed to Cloudflare Pages
✅ Available at: `https://[your-project].pages.dev`
⏳ Waiting for custom domain connection

Once configured, your domain will point to the deployed website!
