// This file helps Vercel understand this is a Node.js project
// and performs minimal build-time checks
const fs = require('fs');
const path = require('path');

// Check for critical files
const criticalFiles = ['server.js', 'package.json', 'vercel.json'];
const missingFiles = criticalFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length) {
  console.error(`Error: Missing critical files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('Backend build verification complete. Ready for deployment!');