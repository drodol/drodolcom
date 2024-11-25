import type { APIRoute } from 'astro';
import { BskyAgent } from '@atproto/api';

export const prerender = false; // Ensure this runs as an API endpoint

export const GET: APIRoute = async () => {
  try {
    // Set cache control headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      'X-Request-Time': new Date().toISOString(),
    });

    // Initialize Bluesky agent
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({
      identifier: import.meta.env.BLUESKY_USERNAME,
      password: import.meta.env.BLUESKY_APP_PASSWORD,
    });

    // Get latest post
    const response = await agent.getAuthorFeed({ actor: 'drodol.com' });
    const latestPost = response.data.feed[0];

    return new Response(JSON.stringify({ post: latestPost.post }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching Bluesky post:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
