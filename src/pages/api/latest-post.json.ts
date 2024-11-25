// Trigger rebuild with environment variables
import type { APIRoute } from 'astro';
import { AtpAgent } from '@atproto/api';

export const prerender = false;

export const GET: APIRoute = async ({ request, clientAddress, locals }) => {
  console.log('API Request received at:', new Date().toISOString());
  
  try {
    // Try both runtime and import.meta.env
    const env = (locals?.runtime?.env as Record<string, string>) || {};
    const username = env.BLUESKY_USERNAME || import.meta.env.BLUESKY_USERNAME;
    const password = env.BLUESKY_APP_PASSWORD || import.meta.env.BLUESKY_APP_PASSWORD;

    console.log('Environment check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      usingRuntime: !!env.BLUESKY_USERNAME,
    });

    if (!username || !password) {
      console.error('Missing Bluesky credentials:', {
        hasUsername: !!username,
        hasPassword: !!password,
        nodeEnv: process.env.NODE_ENV
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: `Missing ${!username ? 'username' : ''} ${!password ? 'password' : ''}`.trim()
        }), 
        { 
          status: 500,
          headers: new Headers({
            'Content-Type': 'application/json',
          })
        }
      );
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'X-Request-Time': new Date().toISOString(),
    });

    const agent = new AtpAgent({ service: 'https://bsky.social' });
    await agent.login({
      identifier: username,
      password: password,
    });

    const response = await agent.api.app.bsky.feed.getAuthorFeed({ actor: username });
    const latestPost = response.data.feed[0];

    if (!latestPost) {
      return new Response(
        JSON.stringify({ error: 'No posts found' }), 
        { 
          status: 404,
          headers,
        }
      );
    }

    return new Response(
      JSON.stringify({ post: latestPost.post }), 
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Error fetching Bluesky post:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch post',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }
    );
  }
};
