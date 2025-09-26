#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BLOG_DIR = '/Users/dave/Developer/drodolcom/src/content/blog';
const IMAGES_DIR = '/Users/dave/Developer/drodolcom/public/images/blog';
const VAULT_IMAGES_DIR = '/Users/dave/2025 Vault/drodol.com Blog/images';

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : http;

        protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                const writeStream = fs.createWriteStream(filepath);
                response.pipe(writeStream);

                writeStream.on('finish', () => {
                    writeStream.close();
                    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
                    resolve();
                });

                writeStream.on('error', reject);
            } else {
                reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            }
        }).on('error', reject);
    });
}

function getImageFilename(url, postSlug, index = '') {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let filename = path.basename(pathname);

    // If no extension, try to get it from the URL or default to jpg
    if (!path.extname(filename)) {
        filename += '.jpg';
    }

    // Prefix with post slug for organization
    const cleanFilename = `${postSlug}${index ? `-${index}` : ''}-${filename}`;
    return cleanFilename.replace(/[^a-zA-Z0-9.-]/g, '-');
}

function getPostSlug(filepath) {
    return path.basename(filepath, '.md');
}

async function processFile(filepath) {
    const postSlug = getPostSlug(filepath);
    console.log(`\n🔍 Processing: ${postSlug}`);

    let content = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    // Process hero images
    const heroImageMatch = content.match(/heroImage:\s*"([^"]+)"/);
    if (heroImageMatch) {
        const heroUrl = heroImageMatch[1];
        const heroFilename = getImageFilename(heroUrl, postSlug, 'hero');
        const heroPath = path.join(IMAGES_DIR, heroFilename);

        try {
            await downloadImage(heroUrl, heroPath);
            content = content.replace(
                /heroImage:\s*"[^"]+"/,
                `heroImage: "/images/blog/${heroFilename}"`
            );
            modified = true;
        } catch (error) {
            console.error(`❌ Failed to download hero image: ${error.message}`);
        }
    }

    // Process inline images
    const inlineImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let match;
    let inlineIndex = 1;

    while ((match = inlineImageRegex.exec(content)) !== null) {
        const [fullMatch, altText, imageUrl] = match;
        const inlineFilename = getImageFilename(imageUrl, postSlug, inlineIndex);
        const inlinePath = path.join(IMAGES_DIR, inlineFilename);

        try {
            await downloadImage(imageUrl, inlinePath);
            content = content.replace(
                fullMatch,
                `![${altText}](images/${inlineFilename})`
            );
            modified = true;
            inlineIndex++;
        } catch (error) {
            console.error(`❌ Failed to download inline image: ${error.message}`);
        }
    }

    // Write updated content if modified
    if (modified) {
        fs.writeFileSync(filepath, content);
        console.log(`📝 Updated: ${postSlug}.md`);
    }
}

async function main() {
    console.log('🚀 Starting image migration...\n');

    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(BLOG_DIR, file));

    for (const file of files) {
        try {
            await processFile(file);
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }

    console.log('\n✨ Image migration complete!');
    console.log(`📁 Images saved to: ${IMAGES_DIR}`);
    console.log(`🔗 Vault symlink: ${VAULT_IMAGES_DIR}`);
}

main().catch(console.error);