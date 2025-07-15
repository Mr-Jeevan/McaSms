const fs = require('fs');
const path = require('path');

/**
 * Project organization script
 * Ensures all files are in their proper directories
 */

const projectRoot = path.join(__dirname, '..');
const requiredDirs = [
  'config',
  'routes', 
  'services',
  'utils',
  'middleware',
  'scripts',
  'tests',
  'docs',
  'PRODUCT KEY'
];

const cleanupFiles = [
  'debug-env.js',
  'temp.js',
  'temp.json',
  '.tmp'
];

function organizeProject() {
  console.log('🔧 Organizing project structure...');
  
  // Create required directories
  requiredDirs.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  // Clean up unwanted files
  cleanupFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: ${file}`);
    }
  });
  
  // Verify core files exist
  const coreFiles = [
    'server.js',
    'package.json',
    '.env',
    '.env.example',
    '.gitignore'
  ];
  
  console.log('\n✅ Core files check:');
  coreFiles.forEach(file => {
    const exists = fs.existsSync(path.join(projectRoot, file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
  
  // Check organized structure
  console.log('\n📁 Directory structure:');
  requiredDirs.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
    console.log(`  ${dir}/ (${files.length} files)`);
  });
  
  console.log('\n🎉 Project organization complete!');
}

// Run if called directly
if (require.main === module) {
  organizeProject();
}

module.exports = organizeProject;
