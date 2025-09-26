#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const BLOG_DIR = '/Users/dave/Developer/drodolcom/src/content/blog';
const IMAGES_DIR = '/Users/dave/Developer/drodolcom/public/images/blog';

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : http;

        const timeout = setTimeout(() => {
            reject(new Error('Download timeout'));
        }, 30000); // 30 second timeout

        const request = protocol.get(url, (response) => {
            clearTimeout(timeout);

            if (response.statusCode === 200) {
                const writeStream = fs.createWriteStream(filepath);
                response.pipe(writeStream);

                writeStream.on('finish', () => {
                    writeStream.close();
                    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
                    resolve();
                });

                writeStream.on('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            } else {
                reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            }
        });

        request.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });

        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
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
    const downloads = [];

    // Collect hero images
    const heroImageMatch = content.match(/heroImage:\s*"([^"]+)"/);
    if (heroImageMatch) {
        const heroUrl = heroImageMatch[1];
        const heroFilename = getImageFilename(heroUrl, postSlug, 'hero');
        const heroPath = path.join(IMAGES_DIR, heroFilename);

        if (!fs.existsSync(heroPath)) {
            downloads.push({
                type: 'hero',
                url: heroUrl,
                filename: heroFilename,
                path: heroPath,
                replace: (content) => content.replace(
                    /heroImage:\s*"[^"]+"/,
                    `heroImage: "/images/blog/${heroFilename}"`
                )
            });
        }
    }

    // Collect inline images
    const inlineImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let match;
    let inlineIndex = 1;

    const originalContent = content;
    while ((match = inlineImageRegex.exec(originalContent)) !== null) {
        const [fullMatch, altText, imageUrl] = match;
        const inlineFilename = getImageFilename(imageUrl, postSlug, inlineIndex);
        const inlinePath = path.join(IMAGES_DIR, inlineFilename);

        if (!fs.existsSync(inlinePath)) {
            downloads.push({
                type: 'inline',
                url: imageUrl,
                filename: inlineFilename,
                path: inlinePath,
                fullMatch,
                altText,
                replace: (content) => content.replace(
                    fullMatch,
                    `![${altText}](images/${inlineFilename})`
                )
            });
        }
        inlineIndex++;
    }

    // Download images sequentially with retry
    for (const download of downloads) {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                console.log(`📥 Downloading ${download.type}: ${download.filename} (attempt ${attempts + 1})`);
                await downloadImage(download.url, download.path);
                content = download.replace(content);
                modified = true;
                break;
            } catch (error) {
                attempts++;
                console.error(`❌ Attempt ${attempts} failed: ${error.message}`);

                if (attempts === maxAttempts) {
                    console.error(`💥 Failed to download after ${maxAttempts} attempts: ${download.url}`);
                }

                // Wait before retry
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
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
        .filter(file => file.endsWith('.md') && !file.includes('obsidian-integration-test'))
        .map(file => path.join(BLOG_DIR, file));

    for (const file of files) {
        try {
            await processFile(file);
            // Small delay between files
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }

    console.log('\n✨ Image migration complete!');
    console.log(`📁 Images saved to: ${IMAGES_DIR}`);
}

main().catch(console.error);