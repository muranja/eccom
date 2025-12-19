/**
 * Responsive Image Generator
 * Generates multiple sizes of product images for responsive loading
 * 
 * Usage: node scripts/generate-responsive-images.mjs
 * 
 * Output sizes:
 * - 400w: Mobile (card thumbnails)
 * - 800w: Tablet (grid display)  
 * - 1200w: Desktop (product detail page)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = './public/images/products';
const OUTPUT_DIR = './public/images/products/responsive';

// Sizes to generate (width in pixels)
const SIZES = [400, 800, 1200];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all source images (webp files)
const files = fs.readdirSync(INPUT_DIR).filter(f =>
    f.endsWith('.webp') && !f.includes('@')
);

console.log(`\n🖼️  Responsive Image Generator`);
console.log(`   Found ${files.length} source images\n`);

let generated = 0;

for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = file.replace('.webp', '');

    console.log(`Processing: ${file}`);

    for (const width of SIZES) {
        const outputFilename = `${baseName}@${width}w.webp`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);

        // Skip if already exists
        if (fs.existsSync(outputPath)) {
            console.log(`   ⏭️  ${outputFilename} (exists)`);
            continue;
        }

        try {
            await sharp(inputPath)
                .resize(width, null, {
                    withoutEnlargement: true,  // Don't upscale small images
                    fit: 'inside'
                })
                .webp({ quality: 80 })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            console.log(`   ✅ ${outputFilename} (${sizeKB} KB)`);
            generated++;
        } catch (err) {
            console.error(`   ❌ Failed: ${err.message}`);
        }
    }
}

console.log(`\n✨ Done! Generated ${generated} responsive images.`);
console.log(`   Output: ${OUTPUT_DIR}\n`);

// Generate srcset helper info
console.log(`📋 Srcset format for components:`);
console.log(`   srcset="/images/products/responsive/{name}@400w.webp 400w,`);
console.log(`           /images/products/responsive/{name}@800w.webp 800w,`);
console.log(`           /images/products/responsive/{name}@1200w.webp 1200w"`);
console.log(`   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"\n`);
