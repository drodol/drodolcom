#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const OBSIDIAN_IMAGES = '/Users/dave/2025 Vault/drodol.com Blog/images';
const PUBLIC_IMAGES = '/Users/dave/Developer/drodolcom/public/images';

async function syncImages() {
  try {
    // Ensure public/images directory exists
    await fs.mkdir(PUBLIC_IMAGES, { recursive: true });

    // Read all files from Obsidian images directory
    const files = await fs.readdir(OBSIDIAN_IMAGES);

    let syncedCount = 0;

    for (const file of files) {
      if (file.startsWith('.')) continue; // Skip hidden files

      const sourcePath = path.join(OBSIDIAN_IMAGES, file);
      const targetPath = path.join(PUBLIC_IMAGES, file);

      try {
        // Check if file needs syncing
        const sourceStats = await fs.stat(sourcePath);
        let needsSync = true;

        try {
          const targetStats = await fs.stat(targetPath);
          needsSync = sourceStats.mtime > targetStats.mtime;
        } catch {
          // Target doesn't exist, needs sync
        }

        if (needsSync) {
          await fs.copyFile(sourcePath, targetPath);
          console.log(`✅ Synced: ${file}`);
          syncedCount++;
        }
      } catch (error) {
        console.log(`❌ Error syncing ${file}:`, error.message);
      }
    }

    if (syncedCount === 0) {
      console.log('✨ All images are up to date!');
    } else {
      console.log(`🎉 Synced ${syncedCount} image(s) from Obsidian to blog`);
    }

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

syncImages();