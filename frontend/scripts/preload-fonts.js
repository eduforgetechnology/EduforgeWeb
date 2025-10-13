/**
 * This script generates preload links for critical fonts
 */

const fs = require('fs');
const path = require('path');

// Path to your index.html file
const indexPath = path.resolve(__dirname, '../public/index.html');

// Fonts to preload
const fontsToPreload = [
  // Add your font paths here, for example:
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2'
];

// Read the index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Generate preload links for fonts
  const preloadLinks = fontsToPreload.map(font => 
    `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin="anonymous">`
  ).join('\n    ');

  // Find the position to insert the preload links (after the opening head tag)
  const headTagPos = data.indexOf('<head>') + 6;
  if (headTagPos === 5) {
    console.error('Could not find <head> tag in index.html');
    return;
  }

  // Insert the preload links
  const newHtml = data.slice(0, headTagPos) + 
                 '\n    <!-- Preloaded Fonts -->\n    ' + 
                 preloadLinks + 
                 data.slice(headTagPos);

  // Write the updated file back
  fs.writeFile(indexPath, newHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('✅ Font preloading links added to index.html');
  });
});