import { Agent, CredentialSession } from '@atproto/api'
import type { APIRoute } from 'astro'

// Force dynamic rendering
export const prerender = false

// Add cache control header
export const GET: APIRoute = async ({ request }) => {
  const requestTime = new Date()
  console.log('[API] Latest post request received:', requestTime.toISOString())
  
  const username = import.meta.env.BLUESKY_USERNAME
  const password = import.meta.env.BLUESKY_APP_PASSWORD

  console.log('[API] Checking credentials:', { 
    hasUsername: !!username, 
    hasPassword: !!password,
    username: username // Log actual username to verify it's correct
  })

  if (!username || !password) {
    console.error('[API] Missing credentials')
    return new Response(
      JSON.stringify({ 
        error: 'Bluesky credentials not configured',
        serverTime: requestTime.toISOString()
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  try {
    console.log('[API] Creating Bluesky session')
    const session = new CredentialSession(new URL('https://bsky.social'), undefined, undefined)
    const agent = new Agent(session)

    console.log('[API] Attempting login')
    await session.login({
      identifier: username,
      password: password
    })

    // First get profile to verify we're authenticated
    console.log('[API] Fetching profile')
    const profileResponse = await agent.getProfile({ actor: username })
    console.log('[API] Profile response:', {
      handle: profileResponse.data.handle,
      postsCount: profileResponse.data.postsCount,
      followersCount: profileResponse.data.followersCount,
      lastPostedAt: profileResponse.data.associated?.post?.indexedAt
    })

    // Get feed with cursor to ensure latest posts
    console.log('[API] Fetching author feed')
    const feedResponse = await agent.getAuthorFeed({ 
      actor: username,
      limit: 1
    })

    // Double check with a direct post fetch
    if (profileResponse.data.associated?.post?.uri) {
      console.log('[API] Fetching latest post directly')
      const directPost = await agent.getPostThread({
        uri: profileResponse.data.associated.post.uri
      })
      console.log('[API] Direct post:', {
        postUri: directPost.data.thread.post.uri,
        createdAt: directPost.data.thread.post.record.createdAt,
        text: directPost.data.thread.post.record.text
      })
    }

    console.log('[API] Raw feed response:', {
      feedLength: feedResponse.data.feed.length,
      cursor: feedResponse.data.cursor,
      posts: feedResponse.data.feed.map(item => ({
        uri: item.post.uri,
        text: item.post.record.text,
        createdAt: item.post.record.createdAt,
        indexedAt: item.post.indexedAt
      }))
    })

    const latestPost = feedResponse.data.feed[0]?.post ?? null

    console.log('[API] Post details:', {
      text: latestPost?.record?.text,
      createdAt: latestPost?.record?.createdAt,
      indexedAt: latestPost?.indexedAt,
      serverTime: requestTime.toISOString()
    })

    const responseBody = { 
      post: latestPost, 
      timestamp: Date.now(),
      serverTime: requestTime.toISOString(),
      debug: {
        requestTime: requestTime.toISOString(),
        feedLength: feedResponse.data.feed.length,
        postsCount: profileResponse.data.postsCount
      }
    }
    console.log('[API] Sending response:', responseBody)

    return new Response(
      JSON.stringify(responseBody),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    console.error('[API] Error:', error)
    return new Response(
      JSON.stringify({ 
        error, 
        timestamp: Date.now(),
        serverTime: requestTime.toISOString(),
        debug: {
          requestTime: requestTime.toISOString(),
          error: error
        }
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}
