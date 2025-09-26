#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/Users/dave/Developer/drodolcom/src/content/blog';

function getPostSlug(filepath) {
    return path.basename(filepath, '.md');
}

function getImageFilename(url, postSlug, index) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let filename = path.basename(pathname);

    if (!path.extname(filename)) {
        filename += '.jpg';
    }

    return `${postSlug}-${index}-${filename}`;
}

function updateImageReferences(filepath) {
    const postSlug = getPostSlug(filepath);
    console.log(`\n📝 Updating: ${postSlug}`);

    let content = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    // Update hero images
    const heroImageMatch = content.match(/heroImage:\s*"([^"]+)"/);
    if (heroImageMatch && heroImageMatch[1].startsWith('http')) {
        const heroFilename = getImageFilename(heroImageMatch[1], postSlug, 'hero');
        content = content.replace(
            /heroImage:\s*"[^"]+"/,
            `heroImage: "/images/blog/${heroFilename}"`
        );
        modified = true;
        console.log(`  ✅ Updated hero image: ${heroFilename}`);
    }

    // Update inline images
    const inlineImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let match;
    let inlineIndex = 1;

    const originalContent = content;
    while ((match = inlineImageRegex.exec(originalContent)) !== null) {
        const [fullMatch, altText, imageUrl] = match;
        const inlineFilename = getImageFilename(imageUrl, postSlug, inlineIndex);

        content = content.replace(
            fullMatch,
            `![${altText}](/images/blog/${inlineFilename})`
        );
        modified = true;
        console.log(`  ✅ Updated inline image ${inlineIndex}: ${inlineFilename}`);
        inlineIndex++;
    }

    if (modified) {
        fs.writeFileSync(filepath, content);
        console.log(`📁 Updated: ${postSlug}.md`);
    } else {
        console.log(`⏭️  No changes needed: ${postSlug}.md`);
    }
}

async function main() {
    console.log('🔄 Updating image references to local paths...\n');

    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.md') && !file.includes('obsidian-integration-test'))
        .map(file => path.join(BLOG_DIR, file));

    for (const file of files) {
        try {
            updateImageReferences(file);
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }

    console.log('\n✨ Image references updated!');
    console.log('\n📋 Next steps:');
    console.log('1. Run your dev server: npm run dev');
    console.log('2. Visit each post with images');
    console.log('3. Use the browser script to extract images');
    console.log('4. Save images to /public/images/blog/');
}

main().catch(console.error);