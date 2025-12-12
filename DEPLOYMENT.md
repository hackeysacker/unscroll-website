# Deployment Guide

This repository contains multiple projects:
- `website/` - Marketing website (Next.js 15)
- `mobile/` - React Native mobile app
- `nonmobile/` - Web application

## Website Deployment (Cloudflare Pages)

The marketing website in the `website/` folder is configured for Cloudflare Pages deployment.

### Automatic Deployment

The repository has a monorepo structure with the website in a subdirectory. Cloudflare Pages is configured to build from the root, and the root `package.json` includes a `pages:build` script that delegates to the website folder.

**Cloudflare Pages Settings (configure in dashboard):**
- **Framework preset**: None (custom configuration)
- **Build command**: `npm install --legacy-peer-deps && npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (leave empty - builds from repository root)
- **Node version**: 22.16.0 (automatically detected from website/.node-version)

The root-level `pages:build` script automatically:
1. Changes to the `website/` directory
2. Installs website dependencies
3. Runs the Next.js build for Cloudflare Pages
4. Copies the build output to the root `.vercel/` directory for Cloudflare to find

### Manual Deployment

To deploy manually:

```bash
cd website
npm install
npm run pages:build
npm run deploy
```

### Local Development

To run the website locally:

```bash
cd website
npm install
npm run dev
```

The website will be available at `http://localhost:3000`

### Local Preview (Cloudflare Pages)

To preview the production build with Cloudflare Workers:

```bash
cd website
npm run preview
```

## Mobile App Deployment

See `mobile/` folder for React Native deployment instructions.

## Deployment Options (Legacy - Non-Mobile App)

### Static Hosting

The app can be deployed to any static hosting service:

1. **Vercel**: 
   - Connect your repository to Vercel
   - The build command is automatically detected: `npm run build`
   - Output directory: `dist`

2. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages**:
   - Build command: `npm run build`
   - Deploy the `dist` folder contents

4. **Any Web Server**:
   - Build the app: `npm run build`
   - Upload the contents of the `dist/` folder to your web server
   - Ensure your server is configured to serve `index.html` for all routes (SPA routing)

### Server Configuration

For single-page application (SPA) routing to work correctly, configure your server to serve `index.html` for all routes:

**Nginx example:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache example (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Environment Variables

The app supports an optional `TENANT_ID` environment variable for multi-tenant deployments:

```bash
TENANT_ID=your-tenant-id npm run build
```

If not set, the app will use the root path (`/`).

## Progressive Web App (PWA)

The app includes a `manifest.json` file that enables it to be installed as a Progressive Web App (PWA) on supported devices and browsers.

## Browser Support

The app supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)




















