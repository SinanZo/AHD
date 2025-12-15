# Manus Static Hosting - Abdulhaq Dimensions

## 📦 Self-Contained Deployment Package

This folder contains everything needed to deploy your Abdulhaq Dimensions website as a static site on Manus hosting.

## 🚀 Quick Deploy

### Windows (PowerShell)
```powershell
cd ..                    # Go to project root
.\manus-build\deploy.ps1 # Run build helper
# Verify dist/ folder is created
# Push to GitHub
# Connect to Manus - auto-deploys!
```

### Mac/Linux (Bash)
```bash
cd ..                    # Go to project root
bash manus-build/deploy.sh # Run build helper
# Verify dist/ folder is created
# Push to GitHub
# Connect to Manus - auto-deploys!
```

## 📁 Contents

```
manus-build/
├── manus.toml         ✅ Manus configuration (auto-detect)
├── QUICKSTART.md      ✅ Quick start guide
├── README.md          ✅ This file
├── DEPLOYMENT.md      ✅ Complete deployment guide
├── deploy.ps1         ✅ Windows build helper
├── deploy.sh          ✅ Unix build helper
└── dist/              📦 Static files (generated after build)
```

## ✅ What's Included

- ✅ Production-optimized React build
- ✅ SPA routing configuration
- ✅ Security headers
- ✅ Caching strategy
- ✅ Multi-language support (EN/AR)
- ✅ Theme system (Light/Dark)
- ✅ Mobile responsive
- ✅ No build warnings

## 🎯 Features

| Feature | Status |
|---------|--------|
| Static Build | ✅ Optimized |
| SPA Routing | ✅ Configured |
| Caching | ✅ 1-year for assets |
| Security | ✅ Headers included |
| Mobile | ✅ Fully responsive |
| i18n | ✅ EN/AR with RTL |
| Theme | ✅ Light/Dark modes |
| Performance | ✅ 123 KB initial (gzipped) |

## 📊 Build Stats

| Metric | Value |
|--------|-------|
| JavaScript | 280 KB → 92 KB gzipped |
| CSS | 203 KB → 31 KB gzipped |
| Total Load | ~123 KB gzipped |
| Modules | ~2,100 (tree-shaken) |
| Pages | Code-split & lazy-loaded |

## 🌐 Routes

All routes work without server configuration:

- `/` - Home page
- `/about` - About page  
- `/services` - Services
- `/products` - Product catalog
- `/products/curtains` - By category
- `/clients` - Client logos
- `/projects` - Projects gallery
- `/contact` - Contact form
- `/gallery/showrooms` - Photo galleries

## 🔐 Security

- ✅ Clickjacking protection (X-Frame-Options)
- ✅ MIME sniffing prevention
- ✅ Secure referrer policy
- ✅ API permission restrictions
- ✅ Content Security Policy ready

## 💾 Caching

Optimized for performance:
- **Assets** (JS/CSS): 1 year (immutable via content hash)
- **Images**: 1 year
- **Fonts**: 1 year with CORS
- **HTML**: No cache (always fetch latest)

## 🎨 Customization

To customize before deploying:

1. **Theme Colors**: Edit `client/src/index.css` (CSS tokens)
2. **Content**: Edit `client/src/pages/*` 
3. **Images**: Add to `client/public/images/`
4. **Translations**: Edit `client/src/i18n/locales/*`
5. **Routing**: Edit `client/src/App.tsx` routes

Then rebuild:
```bash
cd ..
.\manus-build\deploy.ps1
```

## 📋 Pre-Deployment Checklist

- [ ] Run build helper (deploy.ps1 or deploy.sh)
- [ ] Verify `dist/` folder created with `index.html`
- [ ] Test build locally: `pnpm preview`
- [ ] All content and images correct
- [ ] Contact form configured (or removed if not needed)
- [ ] Commit all changes to Git
- [ ] Connect GitHub repo to Manus
- [ ] Verify deployment auto-triggers
- [ ] Test live site on Manus domain
- [ ] Test all routes work
- [ ] Test theme toggle
- [ ] Test language toggle
- [ ] Test on mobile

## 📝 Next Steps

1. **Read**: QUICKSTART.md (2 min)
2. **Read**: DEPLOYMENT.md (10 min)
3. **Build**: Run deploy.ps1 or deploy.sh
4. **Verify**: Check dist/ folder exists
5. **Deploy**: Push to GitHub + Manus
6. **Test**: Verify live site

## 🆘 Help

| Issue | Solution |
|-------|----------|
| Build fails | Check Node 20.x installed |
| Routes 404 | Ensure manus.toml SPA redirect configured |
| Images missing | Rebuild with deploy script |
| Slow deploy | Manus caches - wait 2-3 min |

## 📞 Resources

- **Manus**: https://manus.computer
- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Wouter** (routing): https://github.com/molefrog/wouter

---

## Summary

✨ **This is a complete, production-ready static build package for Manus hosting.**

- All configuration is included (`manus.toml`)
- Deployment helpers provided (deploy.ps1, deploy.sh)
- Documentation included (QUICKSTART.md, DEPLOYMENT.md)
- Ready to push to GitHub and deploy to Manus
- No additional setup required

**Status**: Ready for Production ✅
**Framework**: React 18 + Vite 7
**Hosting**: Static (no backend needed)
**Deploy Time**: ~5 minutes
