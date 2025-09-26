import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';

// Configure turndown for better HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Read the blog.json file
const blogData = JSON.parse(fs.readFileSync('./blog.json', 'utf8'));

// Create output directory if it doesn't exist
const outputDir = './src/content/blog';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to convert HTML to Markdown
function convertHtmlToMarkdown(html) {
  if (!html || html.trim() === '') return '';

  // Clean up some common issues in the HTML
  let cleanHtml = html
    .replace(/<br\s*\/?>/gi, '\n\n') // Convert <br> to line breaks
    .replace(/&nbsp;/g, ' ') // Convert &nbsp; to spaces
    .replace(/&amp;/g, '&') // Convert &amp; to &
    .replace(/&lt;/g, '<') // Convert &lt; to <
    .replace(/&gt;/g, '>') // Convert &gt; to >
    .replace(/&quot;/g, '"'); // Convert &quot; to "

  return turndownService.turndown(cleanHtml);
}

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to format date
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to Date
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Function to extract categories/tags
function extractTags(post) {
  const tags = [];

  // Add categories as tags
  if (post.post_categories && post.post_categories.length > 0) {
    post.post_categories.forEach(cat => {
      if (cat.category_name) {
        tags.push(cat.category_name.toLowerCase());
      }
    });
  }

  return tags;
}

// Process each blog post
console.log(`Processing ${blogData.posts.length} blog posts...`);

blogData.posts.forEach((post, index) => {
  try {
    // Create filename from post_url or title
    const filename = post.post_url ? `${post.post_url}.md` : `${createSlug(post.post_title)}.md`;
    const filepath = path.join(outputDir, filename);

    // Skip if file already exists (to avoid overwriting)
    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${filename} - file already exists`);
      return;
    }

    // Convert HTML content to Markdown
    const markdownContent = convertHtmlToMarkdown(post.post_text);

    // Extract tags
    const tags = extractTags(post);

    // Create frontmatter
    const frontmatter = [
      '---',
      `title: "${post.post_title.replace(/"/g, '\\"')}"`,
      `description: "${post.post_description.replace(/"/g, '\\"')}"`,
      `pubDate: ${formatDate(post.post_date)}`,
      post.post_updated ? `updatedDate: ${formatDate(post.post_updated)}` : null,
      post.post_image ? `heroImage: "${post.post_image}"` : null,
      tags.length > 0 ? `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]` : 'tags: []',
      'draft: false',
      '---',
      '',
      ''
    ].filter(line => line !== null).join('\n');

    // Combine frontmatter and content
    const fullContent = frontmatter + markdownContent;

    // Write the file
    fs.writeFileSync(filepath, fullContent, 'utf8');
    console.log(`✓ Created: ${filename}`);

  } catch (error) {
    console.error(`Error processing post "${post.post_title}":`, error.message);
  }
});

console.log('Import completed!');
console.log('\nNext steps:');
console.log('1. Review the imported files in src/content/blog/');
console.log('2. Edit any posts that need formatting adjustments');
console.log('3. Run "npm run dev" to see your imported posts');
console.log('4. Delete this import script when satisfied: rm import-blog.js');