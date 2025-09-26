#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/Users/dave/Developer/drodolcom/src/content/blog';

// Original hero image URLs from the grep results
const originalHeroImages = {
    '100-day-experiment': 'https://media.blogmaker.app/e75e5935fbaf7928ff6a6589eec25912.png',
    'careful-of-the-blue-dots': 'https://media.blogmaker.app/a8cea2ea51569e01861ce41ad905c937.jpeg',
    'cause-and-consequence': 'https://media.blogmaker.app/58dce1227446974a9bdb5f9e62d3491b.jpg',
    'doing-the-best-you-can-vs-doing-a-good-job': 'https://media.blogmaker.app/253ec5d3cfa199853d1f1ccbcfcf3b5b.jpg',
    'epomaker-rt100---review': 'https://media.blogmaker.app/0e8799ec0ab66baff1947c168b55e86d.webp',
    'focus': 'https://media.blogmaker.app/ecd4ec2e3f5e96582ce3a9e973b177969ca619be.jpeg',
    'labels-identity-and-goals': 'https://media.blogmaker.app/f5757e476f3a6904ab661161d98de9029489af09.jpeg',
    'magic': 'https://media.blogmaker.app/8e7bc88cb96d0da22d69d98f61a87acfc6389ba4.jpeg',
    'my-ai-companion': 'https://media.blogmaker.app/b8bd09018c82bdcc3d69fcfbef535dd4.png',
    'new-big-feature': 'https://media.blogmaker.app/776cedb122db60cab4860f8321fb6d30.webp',
    'the-fear-of-success': 'https://media.blogmaker.app/05b892ed281178ad93ca60c1f3b680ca7a54f872.jpeg',
    'the-year-of-focus': 'https://media.blogmaker.app/93e078204fb4e0f64eebf024f0320d56.png',
    'vision': 'https://media.blogmaker.app/f7739020f1d8a5460775755e252fc8fbc49acfbd.jpeg',
    'wait-for-everything-to-be-ok': 'https://media.blogmaker.app/a24e9877369c6092577d3eb26c13a6b0.jpg',
    'what-i-have-vs-what-i-want': 'https://media.blogmaker.app/38b5d1a4283d126a09c3cea5b26eb4ea.png'
};

function restoreHeroImage(filepath) {
    const postSlug = path.basename(filepath, '.md');

    if (!originalHeroImages[postSlug]) {
        return; // No hero image to restore
    }

    let content = fs.readFileSync(filepath, 'utf8');

    const localHeroRegex = /heroImage:\s*"\/images\/blog\/[^"]+"/;

    if (localHeroRegex.test(content)) {
        content = content.replace(
            localHeroRegex,
            `heroImage: "${originalHeroImages[postSlug]}"`
        );

        fs.writeFileSync(filepath, content);
        console.log(`✅ Restored hero image for: ${postSlug}`);
    }
}

function main() {
    console.log('🔄 Restoring original hero image URLs...\n');

    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(BLOG_DIR, file));

    for (const file of files) {
        try {
            restoreHeroImage(file);
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }

    console.log('\n✅ Hero image restoration complete!');
    console.log('🚀 Now run `npm run dev` - all images should show properly!');
}

main();