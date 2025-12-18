import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/images/products';
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.jpg'));

for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(inputDir, file.replace('.jpg', '.webp'));

    await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

    console.log(`Converted: ${file} -> ${file.replace('.jpg', '.webp')}`);
}

console.log('Done!');
