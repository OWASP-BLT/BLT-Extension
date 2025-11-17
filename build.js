const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files and directories to include in the extension package
const includePaths = [
  'manifest.json',
  '_locales',
  'content.js',
  'event.js',
  'img',
  'jobtracking.html',
  'jobtracking.js',
  'libs',
  'linkedin-monitor.js',
  'popup.html',
  'popup.js',
  'screenshot.css',
  'screenshot.html',
  'toolbar.css',
  'toolbar_actions.css',
  'toolbar_edit.css',
  'toolbar_res',
  'toolbar_share.css',
  'wellfound-monitor.js'
];

// Build the zip file
const zipFileName = 'extension.zip';
const zipFilePath = path.join(distDir, zipFileName);

// Remove old zip if it exists
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

// Create zip file with all necessary files
console.log('Building extension package...');
const filesToZip = includePaths.join(' ');

try {
  execSync(`zip -r ${zipFilePath} ${filesToZip}`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log(`\nExtension packaged successfully: ${zipFilePath}`);
  
  // Get file size
  const stats = fs.statSync(zipFilePath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Package size: ${fileSizeInMB} MB`);
} catch (error) {
  console.error('Error building extension:', error.message);
  process.exit(1);
}
