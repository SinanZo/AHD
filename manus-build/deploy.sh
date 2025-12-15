#!/bin/bash
# Bash deployment helper for Manus
# Run from project root: bash manus-build/deploy.sh

set -e

echo "🔨 Building Manus static package..."
echo ""

# Check if we're in project root
if [ ! -d "client/src" ]; then
    echo "❌ Error: Please run from project root"
    echo "   Usage: bash manus-build/deploy.sh"
    exit 1
fi

# Build client
echo "📦 Building client..."
pnpm --filter @ahd/client build

# Organize build
echo ""
echo "📂 Organizing build..."

SOURCE_DIR="client/dist"
TARGET_DIR="manus-build/dist"

# Remove old dist if exists
if [ -d "$TARGET_DIR" ]; then
    rm -rf "$TARGET_DIR"
fi

# Copy new dist
cp -r "$SOURCE_DIR" "$TARGET_DIR"

echo "✅ Build complete!"
echo ""

# Show stats
echo "📊 Build Output:"

if [ -d "$TARGET_DIR" ]; then
    SIZE=$(du -sh "$TARGET_DIR" | cut -f1)
    echo "   Location: $TARGET_DIR"
    echo "   Size: $SIZE"
fi

echo ""
echo "📋 Key Files:"

if [ -f "$TARGET_DIR/index.html" ]; then
    echo "   ✅ index.html (SPA entry point)"
fi

if [ -d "$TARGET_DIR/assets" ]; then
    COUNT=$(find "$TARGET_DIR/assets" -type f | wc -l)
    echo "   ✅ assets/ ($COUNT files)"
fi

if [ -d "$TARGET_DIR/images" ]; then
    COUNT=$(find "$TARGET_DIR/images" -type f | wc -l)
    echo "   ✅ images/ ($COUNT files)"
fi

if [ -d "$TARGET_DIR/videos" ]; then
    echo "   ✅ videos/"
fi

echo ""
echo "🚀 Ready for Manus Deployment!"
echo ""
echo "📋 Next Steps:"
echo "   1. Verify: ls manus-build/dist/index.html"
echo "   2. Commit: git add manus-build/"
echo "   3. Push: git push origin main"
echo "   4. Deploy: Connect repo to Manus Console"
echo "   5. Verify: Site live at manus.computer domain"
echo ""
echo "📖 See manus-build/README.md for complete guide"
echo ""
