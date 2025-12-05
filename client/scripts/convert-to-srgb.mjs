#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Root of public images
const ROOT = path.resolve(process.cwd(), 'public', 'images');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true }).catch(() => {});
}

async function convertFile(file) {
  try {
    const buf = await fs.readFile(file);
    const img = sharp(buf, { limitInputPixels: false });
    const metadata = await img.metadata();

    // We will re-encode to sRGB. For JPEG use quality 85; for PNG keep lossless.
    const ext = path.extname(file).toLowerCase();
    let outBuf;

    if (ext === '.png') {
      outBuf = await img.toColourspace('srgb').png({ compressionLevel: 9 }).toBuffer();
    } else if (ext === '.webp') {
      outBuf = await img.toColourspace('srgb').webp({ quality: 85 }).toBuffer();
    } else {
      // default to jpeg
      outBuf = await img.toColourspace('srgb').jpeg({ quality: 85 }).toBuffer();
    }

    // Write back to file (in-place). Backup original as .bak once.
    const bak = file + '.bak';
    try {
      await fs.access(bak);
    } catch {
      await fs.copyFile(file, bak);
    }
    await fs.writeFile(file, outBuf);

    console.log(`✓ sRGB ${path.relative(ROOT, file)}${metadata.space ? ` (was ${metadata.space})` : ''}`);
  } catch (err) {
    console.warn(`! Skip ${path.relative(ROOT, file)}: ${err?.message || err}`);
  }
}

async function main() {
  try {
    await fs.access(ROOT);
  } catch {
    console.error(`Public images root not found: ${ROOT}`);
    process.exit(1);
  }

  let count = 0;
  for await (const file of walk(ROOT)) {
    if (!isImage(file)) continue;
    // Skip already processed backups
    if (file.endsWith('.bak')) continue;
    await convertFile(file);
    count++;
  }
  console.log(`Done. Processed ${count} image(s). Backups saved as *.bak.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
