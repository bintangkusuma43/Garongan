const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const sharp = require('c:/xampp/htdocs/Garongan/node_modules/sharp');

const inputDir = 'c:/xampp/htdocs/Garongan/Asset/Jakagarong';
const outputDir = 'c:/xampp/htdocs/Garongan/public/images/jakagarong';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertImages() {
  console.log('Starting HEIC to WebP conversion...');
  
  try {
    const files = fs.readdirSync(inputDir);
    const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic') || f.toLowerCase().endsWith('.heif'));
    
    console.log(`Found ${heicFiles.length} HEIC files in ${inputDir}`);
    
    // Sort files to keep them ordered e.g., JAKAGARONG 1, JAKAGARONG 2...
    heicFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
      return numA - numB;
    });

    for (let i = 0; i < heicFiles.length; i++) {
      const filename = heicFiles[i];
      const inputPath = path.join(inputDir, filename);
      const outFilename = `jakagarong-${i + 1}.webp`;
      const outputPath = path.join(outputDir, outFilename);
      
      console.log(`[${i + 1}/${heicFiles.length}] Processing ${filename}...`);
      
      const inputBuffer = fs.readFileSync(inputPath);
      
      // 1. Convert HEIC to JPEG buffer
      const jpegBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
      });
      
      // 2. Use sharp to resize and encode to WebP (max width/height 1600px, 80% quality)
      await sharp(jpegBuffer)
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      const origSizeMB = (inputBuffer.length / (1024 * 1024)).toFixed(2);
      const webpSizeKB = (fs.readFileSync(outputPath).length / 1024).toFixed(1);
      
      console.log(`  ✓ Saved as ${outFilename} (${origSizeMB} MB -> ${webpSizeKB} KB)`);
    }
    
    console.log('\nAll images converted and compressed successfully!');
  } catch (err) {
    console.error('Error during image conversion:', err);
  }
}

convertImages();
