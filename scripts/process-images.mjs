import sharp from 'sharp';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FAVICON_BASE = 'C:/Users/surya/.gemini/antigravity-ide/brain/9a52133a-247b-497e-bdae-246c6b391140/favicon_base_1781850870214.png';
const OG_IMAGE_BASE = 'C:/Users/surya/.gemini/antigravity-ide/brain/9a52133a-247b-497e-bdae-246c6b391140/og_image_base_1781850892112.png';

const PUBLIC_DIR = join(__dirname, '../public');

async function processImages() {
  console.log('Starting image processing...');

  // 1. Process OG Image (1200x630, JPEG)
  const ogPath = join(PUBLIC_DIR, 'og-image.jpg');
  console.log(`Processing OG Image -> ${ogPath}`);
  await sharp(OG_IMAGE_BASE)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(ogPath);
  console.log('✓ OG Image processed.');

  // 2. Process Favicon PNGs
  const favicon32Path = join(PUBLIC_DIR, 'favicon-32x32.png');
  const favicon16Path = join(PUBLIC_DIR, 'favicon-16x16.png');

  console.log(`Processing Favicon 32x32 -> ${favicon32Path}`);
  const png32 = await sharp(FAVICON_BASE)
    .ensureAlpha()
    .resize(32, 32)
    .png({ colourType: 'truecolor-alpha' })
    .toBuffer();
  await fs.promises.writeFile(favicon32Path, png32);

  console.log(`Processing Favicon 16x16 -> ${favicon16Path}`);
  const png16 = await sharp(FAVICON_BASE)
    .ensureAlpha()
    .resize(16, 16)
    .png({ colourType: 'truecolor-alpha' })
    .toBuffer();
  await fs.promises.writeFile(favicon16Path, png16);
  console.log('✓ PNG Favicons processed.');

  // 3. Process Favicon ICO (wrapper containing 32x32 PNG)
  const icoPath = join(PUBLIC_DIR, 'favicon.ico');
  console.log(`Generating ICO -> ${icoPath}`);
  
  const icoHeader = Buffer.alloc(22);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type = 1 (Icon)
  icoHeader.writeUInt16LE(1, 4); // Count = 1 (1 image)

  icoHeader.writeUInt8(32, 6); // Width
  icoHeader.writeUInt8(32, 7); // Height
  icoHeader.writeUInt8(0, 8); // Color palette
  icoHeader.writeUInt8(0, 9); // Reserved
  icoHeader.writeUInt16LE(1, 10); // Color planes
  icoHeader.writeUInt16LE(32, 12); // Bits per pixel
  icoHeader.writeUInt32LE(png32.length, 14); // Size of PNG data
  icoHeader.writeUInt32LE(22, 18); // Offset to PNG data (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, png32]);
  await fs.promises.writeFile(icoPath, icoBuffer);
  console.log('✓ Favicon ICO generated.');

  console.log('All images processed successfully!');
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
