const fs = require('fs');
const path = require('path');

const targetDirs = ['dist', 'out', '.next', 'public'];

targetDirs.forEach((dir) => {
  const targetPath = path.resolve(__dirname, dir);
  fs.mkdirSync(targetPath, { recursive: true });

  // Copy HTML
  if (fs.existsSync(path.resolve(__dirname, 'index.html'))) {
    fs.copyFileSync(path.resolve(__dirname, 'index.html'), path.join(targetPath, 'index.html'));
  }

  // Copy JS
  if (fs.existsSync(path.resolve(__dirname, 'scrub-engine.js'))) {
    fs.copyFileSync(path.resolve(__dirname, 'scrub-engine.js'), path.join(targetPath, 'scrub-engine.js'));
  }

  // Copy _headers
  if (fs.existsSync(path.resolve(__dirname, '_headers'))) {
    fs.copyFileSync(path.resolve(__dirname, '_headers'), path.join(targetPath, '_headers'));
  }

  // Copy assets folder
  const assetsSrc = path.resolve(__dirname, 'assets');
  const assetsDest = path.join(targetPath, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  }
});

console.log('✓ Static build output synced across all output directories (.next, dist, out, public, .)');
