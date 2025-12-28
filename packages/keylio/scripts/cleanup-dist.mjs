import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

function removeFolder(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${folderPath}`);
    }
  } catch (error) {
    console.error(`✗ Error removing ${folderPath}:`, error.message);
  }
}

function cleanupDist() {
  console.log(`Cleaning up dist directory: ${distDir}`);

  // Remove node_modules
  removeFolder(path.join(distDir, 'node_modules'));

  // Remove _virtual folder
  removeFolder(path.join(distDir, '_virtual'));

  // Remove any nested .pnpm folders in packages
  const packagesDir = path.join(distDir, 'packages');
  if (fs.existsSync(packagesDir)) {
    const walkDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            if (file === '.pnpm') {
              removeFolder(filePath);
            } else {
              walkDir(filePath);
            }
          }
        });
      } catch (error) {
        // Ignore errors for individual directory reads
      }
    };
    walkDir(packagesDir);
  }

  console.log('✓ Cleanup complete');
}

cleanupDist();
