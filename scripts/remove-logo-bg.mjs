/**
 * remove-logo-bg.mjs
 * Uses sharp (bundled with Next.js) to make near-black pixels transparent.
 * Run: node scripts/remove-logo-bg.mjs
 */

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT  = join(__dirname, '../public/varanasi-logo.png');
const OUTPUT = join(__dirname, '../public/varanasi-logo-transparent.png');

// Load image, ensure 4-channel RGBA, get raw pixel buffer
const image = sharp(INPUT).ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

const BLACK_THRESHOLD = 18;   // only pure/near-pure black becomes transparent
const FEATHER_MAX     = 38;   // very short feather to keep dark atmosphere

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const brightness = Math.max(r, g, b);

  if (brightness <= BLACK_THRESHOLD) {
    data[i + 3] = 0;
  } else if (brightness < FEATHER_MAX) {
    const t = (brightness - BLACK_THRESHOLD) / (FEATHER_MAX - BLACK_THRESHOLD);
    data[i + 3] = Math.round(t * 255);
  }
  // else: original alpha kept (logo artwork)
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 }
})
  .png({ compressionLevel: 9 })
  .toFile(OUTPUT);

console.log(`✓ Transparent logo written to: ${OUTPUT}`);
console.log(`  Size: ${info.width} × ${info.height}px`);
