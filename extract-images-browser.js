// Browser Console Script for Image Extraction
// Run this in browser console while viewing your blog post at localhost:4321

(function() {
    const images = [];
    const postTitle = document.querySelector('h1').textContent.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Find all images with remote URLs
    document.querySelectorAll('img[src*="editor.blogstatic.io"], img[src*="editor.blogmaker.app"]').forEach((img, index) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        const filename = `${postTitle}-${index + 1}-${img.src.split('/').pop()}`;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        images.push({
            filename: filename,
            dataUrl: dataUrl,
            originalSrc: img.src
        });

        console.log(`Captured: ${filename}`);
    });

    // Create download links
    images.forEach(img => {
        const link = document.createElement('a');
        link.href = img.dataUrl;
        link.download = img.filename;
        link.textContent = `Download ${img.filename}`;
        link.style.display = 'block';
        link.style.margin = '10px';
        link.style.padding = '10px';
        link.style.background = '#f0f0f0';
        link.style.color = '#333';
        document.body.appendChild(link);
    });

    console.log(`Found ${images.length} images. Download links added to page.`);
})();