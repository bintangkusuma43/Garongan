/**
 * Client-side utility for converting HEIC/HEIF images and compressing JPEG/PNG into WebP format.
 * Utilizes HTML5 Canvas for encoding to WebP and heic2any dynamically for HEIC decoding.
 */

export async function convertAndCompressToWebp(file: File, maxDimension: number = 1600, quality: number = 0.8): Promise<File> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  let imageBlob: Blob = file;

  // 1. If the file is HEIC/HEIF, convert it to a standard PNG Blob first
  if (fileExt === 'heic' || fileExt === 'heif') {
    try {
      // Dynamically import heic2any to avoid SSR pre-rendering issues during build
      const heic2any = (await import('heic2any')).default;
      
      const converted = await heic2any({
        blob: file,
        toType: 'image/png',
      });

      // heic2any can return an array of blobs if it is an animated HEIC, but we want the first image
      imageBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.error('HEIC conversion failed, uploading original file:', err);
      return file; // Fallback to original file on failure
    }
  }

  // 2. Load the image blob into an Image object to draw on Canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);
    
    img.onload = () => {
      // Clean up object URL memory
      URL.revokeObjectURL(url);

      // Determine dimensions while keeping aspect ratio within maxDimension limits
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Create Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get 2D canvas context'));
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export canvas content as a WebP blob
      canvas.toBlob(
        (webpBlob) => {
          if (!webpBlob) {
            reject(new Error('Canvas WebP generation returned null'));
            return;
          }

          // Generate file name ending in .webp
          const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const webpFile = new File([webpBlob], `${originalName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
