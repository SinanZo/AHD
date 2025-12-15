# Manus Static Deployment - Complete Guide

## Overview

This is a self-contained static build package for Manus hosting. It contains all configuration and deployment helpers needed to publish Abdulhaq Dimensions as a static site.

## 📁 Folder Structure

```
manus-build/
├── manus.toml              # Manus build configuration
├── QUICKSTART.md           # Quick start (you are here)
├── README.md               # Deployment overview
├── DEPLOYMENT.md           # Detailed guide
├── deploy.ps1              # Windows deployment helper
├── deploy.sh               # Mac/Linux deployment helper
└── dist/                   # Static build files (generated)
    ├── index.html
    ├── assets/
    ├── images/
    └── ...
```

## 🚀 Deployment Steps

### From the Project Root

**1. Build the static site**

```powershell
# Windows PowerShell
.\manus-build\deploy.ps1
```

```bash
# Mac/Linux
bash manus-build/deploy.sh
```

This will:
- Build the client from source
- Copy static files to `manus-build/dist/`
- Show build statistics
- Confirm ready for deployment

**2. Verify the build**

```bash
cd manus-build
ls dist/        # Should show: index.html, assets/, images/, etc.
```

**3. Deploy to Manus**

**Option A: Automatic (Recommended)**
```bash
# From project root
git add manus-build/
git commit -m "Add Manus static build"
git push origin main

# Then in Manus Console:
# 1. Go to https://manus.computer
# 2. Create new project from your GitHub repo
# 3. Manus detects manus-build/manus.toml
# 4. Auto-deployment starts
```

**Option B: Manual Upload**
1. Copy contents of `manus-build/dist/` 
2. Upload to Manus static hosting
3. Configure URL routing (all routes → index.html)

## 🔧 Configuration

### manus.toml

```toml
[build]
  command = "pnpm --filter @ahd/client build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**What it does:**
- Runs the build in the main project
- Points to `dist/` as publish directory
- Routes all requests to `index.html` (SPA fallback)

### Caching Strategy

- **Assets** (`/assets/*`): 1 year (immutable)
- **Images** (`/images/*`): 1 year
- **Fonts** (`/fonts/*`): 1 year
- **HTML** (`index.html`): No cache (always fresh)

### Security Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Camera/Mic/Geolocation: disabled

## 🌍 Supported Routes

All routes are client-side and work without server configuration:

```
/                    Home
/about               About page
/services            Services
/products            Product catalog
/products/:cat       Product by category
/clients             Client logos
/projects            Projects
/contact             Contact form
/gallery/:cat        Photo galleries
```

## 🎨 Features

- **Multi-language**: English and Arabic (RTL support)
- **Theme**: Light mode (default) + Dark mode toggle
- **Mobile**: Fully responsive
- **Performance**: ~123 KB initial load (gzipped)
- **SEO**: Structured data, meta tags, sitemaps

## 📝 Contact Form

The contact form is included but requires a backend API:

**Current endpoint**: `POST /api/contact`

**Options:**
1. Keep as-is (form will fail silently if no backend)
2. Remove the form from `src/pages/ContactPage.tsx`
3. Set up a serverless function on Manus to handle submissions

## ⚡ Build Details

| Metric | Value |
|--------|-------|
| Modules | ~2,100 |
| Main JS | 280 KB (92 KB gzipped) |
| CSS | 203 KB (31 KB gzipped) |
| Images | Optimized & cached |
| Fonts | Cached 1 year |
| Build Time | ~5 seconds |
| Output | Production-optimized |

## 🔍 Verification Checklist

Before deploying:

- [ ] `manus-build/dist/` exists with index.html
- [ ] `manus-build/manus.toml` is configured
- [ ] All files committed to Git
- [ ] GitHub repo connected to Manus
- [ ] Build triggers automatically

After deployment:

- [ ] Site loads at Manus URL
- [ ] All routes accessible (/, /about, /products, etc.)
- [ ] Theme toggle works
- [ ] Language toggle works (EN/AR)
- [ ] Mobile responsive
- [ ] Footer displays correctly
- [ ] No console errors

## 🆘 Troubleshooting

### Routes show 404

**Solution**: Ensure `manus.toml` has the SPA redirect:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Images/videos not loading

**Solution**: Verify `dist/` includes these folders:
```bash
ls dist/images/
ls dist/videos/
```

If missing, rebuild with `deploy.ps1` or `deploy.sh`.

### Theme not persisting

**Solution**: Check localStorage is enabled. Theme preference persists across sessions using browser storage.

### Build fails

**Solution**: 
1. Ensure Node 20.x is installed: `node --version`
2. Install dependencies: `pnpm install`
3. Try again: `.\manus-build\deploy.ps1`

## 📞 Support

- **Manus Docs**: https://manus.computer
- **Vite Guide**: https://vitejs.dev/guide/static-deploy.html
- **React Router**: https://reactrouter.com

## 📋 File Reference

| File | Purpose |
|------|---------|
| `manus.toml` | Build and deployment config |
| `deploy.ps1` | Windows build helper |
| `deploy.sh` | Unix build helper |
| `QUICKSTART.md` | Quick start guide |
| `README.md` | Deployment overview |
| `DEPLOYMENT.md` | This detailed guide |
| `dist/` | Static files (generated) |

---

**Status**: Ready for Production
**Framework**: React 18 + Vite 7
**Hosting Type**: Static (no server)
**Build Date**: December 15, 2025
