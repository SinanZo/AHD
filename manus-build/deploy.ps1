# PowerShell deployment helper for Manus
# Run from project root: .\manus-build\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔨 Building Manus static package..." -ForegroundColor Cyan
Write-Host ""

try {
    # Check if we're in project root
    if (-not (Test-Path "client\src")) {
        Write-Host "❌ Error: Please run from project root" -ForegroundColor Red
        Write-Host "   Usage: .\manus-build\deploy.ps1" -ForegroundColor Yellow
        exit 1
    }
    
    # Build client
    Write-Host "📦 Building client..." -ForegroundColor Cyan
    & pnpm --filter @ahd/client build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Copy dist to manus-build
    Write-Host ""
    Write-Host "📂 Organizing build..." -ForegroundColor Cyan
    
    $sourceDir = "client\dist"
    $targetDir = "manus-build\dist"
    
    # Remove old dist if exists
    if (Test-Path $targetDir) {
        Remove-Item -Path $targetDir -Recurse -Force
    }
    
    # Copy new dist
    Copy-Item -Path $sourceDir -Destination $targetDir -Recurse
    
    Write-Host "✅ Build complete!" -ForegroundColor Green
    Write-Host ""
    
    # Show stats
    Write-Host "📊 Build Output:" -ForegroundColor Cyan
    
    $distSize = (Get-ChildItem -Path $targetDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Location: $targetDir" -ForegroundColor Yellow
    Write-Host "   Size: $([Math]::Round($distSize, 2)) MB"
    
    # List key files
    Write-Host ""
    Write-Host "📋 Key Files:" -ForegroundColor Cyan
    if (Test-Path "$targetDir\index.html") {
        Write-Host "   ✅ index.html (SPA entry point)" -ForegroundColor Green
    }
    if (Test-Path "$targetDir\assets") {
        $assetCount = (Get-ChildItem "$targetDir\assets" | Measure-Object).Count
        Write-Host "   ✅ assets/ ($assetCount files)" -ForegroundColor Green
    }
    if (Test-Path "$targetDir\images") {
        $imageCount = (Get-ChildItem "$targetDir\images" -Recurse | Measure-Object).Count
        Write-Host "   ✅ images/ ($imageCount files)" -ForegroundColor Green
    }
    if (Test-Path "$targetDir\videos") {
        Write-Host "   ✅ videos/" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🚀 Ready for Manus Deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Verify: dir manus-build\dist\index.html" -ForegroundColor White
    Write-Host "   2. Commit: git add manus-build/" -ForegroundColor White
    Write-Host "   3. Push: git push origin main" -ForegroundColor White
    Write-Host "   4. Deploy: Connect repo to Manus Console" -ForegroundColor White
    Write-Host "   5. Verify: Site live at manus.computer domain" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See manus-build/README.md for complete guide" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
