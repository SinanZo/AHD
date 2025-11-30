Hero video variants for the site

Place your master hero video (high-quality) in the repository or run the helper script to generate optimized variants.

Preferred filenames (what the code expects):
- public/Blinds.mp4        # High-quality MP4, used on fast connections
- public/Blinds-720.mp4    # 720p MP4 fallback for slower networks
- public/Blinds-480.mp4    # Optional low-res MP4
- public/Blinds.webm       # WebM (VP9) for browsers that prefer WebM

Recommended workflow (PowerShell):
1. Install ffmpeg and ensure it's on PATH: https://ffmpeg.org/download.html
2. From the repo root run (modify source path if needed):

   .\scripts\generate-hero-variants.ps1 -Source "C:\path\to\your\Blinds-source.mp4"

Notes:
- The script will produce the WebM and multiple MP4 variants.
- If you already have `public/Blinds.mp4`, the script will use it as the source unless you pass -Source explicitly.
- Use the -Force flag to overwrite existing outputs.

If you prefer to upload files directly, place them in the `public/` folder with the filenames above. The site will automatically use them as fallbacks.

If you'd like, I can add the generated files to the repo if you upload the source file here or let me run ffmpeg in this environment. Otherwise run the script locally and then start the dev server with:

   pnpm dev

Then open the site in a browser and switch the language to Arabic to preview the hero and localized copy.