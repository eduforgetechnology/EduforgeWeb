/**
 * This script optimizes images in the public directory by converting them to WebP format
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Use dynamic imports for ES modules
let imagemin;
let imageminWebp;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

async function optimizeImages() {
  try {
    console.log('🔍 Searching for images to optimize...');
    
    // Dynamically import ES modules
    try {
      imagemin = (await import('imagemin')).default;
      imageminWebp = (await import('imagemin-webp')).default;
    } catch (err) {
      console.error('Failed to import imagemin modules:', err);
      console.log('Installing required packages...');
      console.log('Please run: npm install imagemin imagemin-webp --save-dev');
      return;
    }
    
    // Get all image files from public directory
    const publicDir = path.resolve(__dirname, '../public');
    const srcDir = path.resolve(__dirname, '../src');
    
    // Get all image files recursively
    const publicFiles = await getFiles(publicDir);
    const srcFiles = await getFiles(srcDir);
    
    const allFiles = [...publicFiles, ...srcFiles];
    
    // Filter for image files
    const imageFiles = allFiles.filter(file => 
      /\.(jpe?g|png)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize.`);
    
    // Process each image directory
    for (const file of imageFiles) {
      const dir = path.dirname(file);
      const fileName = path.basename(file);
      
      console.log(`Optimizing: ${fileName}`);
      
      // Convert to WebP
      await imagemin([file], {
        destination: dir,
        plugins: [
          imageminWebp({
            quality: 80,
            method: 6,
          })
        ]
      });
    }
    
    console.log('✅ Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
optimizeImages();