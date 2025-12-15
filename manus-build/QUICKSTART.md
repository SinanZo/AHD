# Manus Static Hosting - Abdulhaq Dimensions

## 🚀 Quick Start

This folder contains everything needed to deploy Abdulhaq Dimensions as a static site on Manus.

### Deploy in 3 Steps

**Step 1: Setup**
```bash
# Make sure you're in the project root (not this manus-build folder)
cd ../..
```

**Step 2: Build**
```powershell
# Windows
.\manus-build\deploy.ps1

# Or Mac/Linux
bash manus-build/deploy.sh
```

**Step 3: Deploy**
- Push to GitHub
- Connect repo to Manus console
- Manus auto-deploys using `manus.toml`

---

## 📦 What's in This Folder

- **manus.toml** - Build config for Manus
- **dist/** - Static files (generated after build)
- **deploy.ps1** - Windows helper script
- **deploy.sh** - Mac/Linux helper script
- **README.md** - Detailed guide
- **DEPLOYMENT.md** - Troubleshooting & config

## 🌐 Routes

All client-side routes work:
- `/` - Home
- `/about` - About
- `/services` - Services  
- `/products` - Products
- `/clients` - Clients
- `/contact` - Contact

## ✨ Features

✅ Production-optimized static build
✅ SPA routing (all routes → index.html)
✅ Caching strategy (1-year for assets)
✅ Security headers
✅ Multi-language (EN/AR)
✅ Light/Dark theme
✅ Mobile responsive

## 📊 Build Size

| File | Size | Gzipped |
|------|------|---------|
| JavaScript | 280 KB | 92 KB |
| CSS | 203 KB | 31 KB |
| **Total** | **483 KB** | **123 KB** |

## 🎯 Next Steps

1. Read **README.md** for setup overview
2. Read **DEPLOYMENT.md** for detailed config
3. Run deployment helper script
4. Push to GitHub
5. Deploy via Manus

---

**Status**: Ready for Production
**Build Date**: December 15, 2025
