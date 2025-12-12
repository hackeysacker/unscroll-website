# Deployment Guide

This app is configured to run as a web application. Follow these steps to build and deploy it.

## Development

To run the app in development mode:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Production Build

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `dist/` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run serve
```

## Deployment Options

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



















