#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/Users/dave/Developer/drodolcom/src/content/blog';

function fixImagePaths(filepath) {
    const postSlug = path.basename(filepath, '.md');

    let content = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    // Fix relative image paths to absolute paths
    const relativeImageRegex = /!\[([^\]]*)\]\(images\/([^)]+)\)/g;

    const newContent = content.replace(relativeImageRegex, (match, altText, imageName) => {
        modified = true;
        console.log(`  ✅ Fixed: images/${imageName} -> /images/blog/${imageName}`);
        return `![${altText}](/images/blog/${imageName})`;
    });

    if (modified) {
        fs.writeFileSync(filepath, newContent);
        console.log(`📁 Fixed paths in: ${postSlug}.md`);
    }
}

function main() {
    console.log('🔧 Fixing relative image paths to absolute paths...\n');

    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(BLOG_DIR, file));

    for (const file of files) {
        const postSlug = path.basename(file, '.md');
        console.log(`🔍 Checking: ${postSlug}`);

        try {
            fixImagePaths(file);
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }

    console.log('\n✨ Path fixing complete!');
}

main().catch(console.error);