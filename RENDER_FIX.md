# ============================================
# RENDER CONFIGURATION - EXACT SETTINGS
# ============================================

## ⚠️ IMPORTANT: Update your Render dashboard with these EXACT settings

### 1. BUILD COMMAND
Copy this exactly into Render's "Build Command" field:

```
pnpm install --frozen-lockfile && pnpm --filter @ahd/client build && pnpm --filter @ahd/server build
```

### 2. START COMMAND  
Copy this exactly into Render's "Start Command" field:

```
pnpm --filter @ahd/server start
```

### 3. ROOT DIRECTORY
Set to: `.` (dot) or leave EMPTY

❌ DO NOT set it to "server" - that causes the "No such file or directory" error

### 4. ENVIRONMENT VARIABLES
Add these in Render dashboard:
- `NODE_ENV` = `production`

---

## Why the Build Failed

Your Render logs show:
```
cd: server: No such file or directory
```

This happens when Render's "Root Directory" is set to `server` or the build command tries to `cd server/`.

Our monorepo structure requires:
- ✅ Build from repository ROOT
- ✅ Use pnpm workspace filters (`-F` or `--filter`)
- ❌ NOT `cd server && npm run build`

---

## How to Fix in Render Dashboard

1. Go to your Render service: https://dashboard.render.com/web/srv-d4msidlu3ip1o73ia8nmnjg/settings
2. Scroll to "Build & Deploy"
3. Update **Build Command**:
   ```
   pnpm install --frozen-lockfile && pnpm --filter @ahd/client build && pnpm --filter @ahd/server build
   ```
4. Update **Start Command**:
   ```
   pnpm --filter @ahd/server start
   ```
5. Set **Root Directory** to: `.` or empty (NOT "server")
6. Click **Save Changes**
7. Manually trigger a redeploy

---

## Expected Build Output

When configured correctly, you'll see:
```
✓ Cloning from https://github.com/SinanZo/AHD
✓ Checking out commit 8d23a44
✓ Running 'pnpm install --frozen-lockfile'
✓ Running 'pnpm --filter @ahd/client build'
  → vite v7.1.9 building for production...
  → ✓ built in X.XXs
✓ Running 'pnpm --filter @ahd/server build'
  → tsc compiling...
  → ✓ compiled successfully
✓ Build succeeded
✓ Running 'pnpm --filter @ahd/server start'
  → Server running on port 3000
```

---

## Troubleshooting

### If build still fails with "cd: server":
- Check "Root Directory" is `.` or empty
- Ensure build command has NO `cd` commands
- Verify branch is `chore/server-build-config` or `main`

### If build succeeds but start fails:
- Check Start Command is exactly: `pnpm --filter @ahd/server start`
- Verify `NODE_ENV=production` is set

### If "Cannot find module" errors:
- Ensure build command includes: `pnpm install --frozen-lockfile`
- Check both client AND server builds run (in that order)

---

## ✅ Latest Fix - 404 Error on /about Route

**Issue Identified:** The server was unable to locate the frontend build assets in production, causing 404 errors on all routes including `/about`.

**Fix Applied:** Updated `server/src/app.ts` to check multiple possible paths for the frontend assets:
1. `dist/public` relative to compiled server location
2. `dist/public` relative to working directory
3. `dist/public` at parent level

The server now logs which path it successfully finds, helping debug any deployment issues.

**Files Modified:**
- ✅ `server/src/app.ts` - Added multi-path resolution with better logging
- ✅ `server/src/index.ts` - Added startup debugging information

**Next Steps:**
1. Commit these changes to your repository
2. Push to GitHub
3. Trigger a manual redeploy in Render dashboard
4. Check the deploy logs to confirm "Found frontend assets at: [path]"

---

## ✅ Your Repo is Ready

**To Deploy the Fix:**
```bash
git add server/src/app.ts server/src/index.ts
git commit -m "fix: resolve frontend asset paths for production deployment"
git push origin main
```

Then trigger a manual redeploy in Render dashboard.
