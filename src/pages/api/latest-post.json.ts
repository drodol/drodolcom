import { Agent, CredentialSession } from '@atproto/api'
import type { APIRoute } from 'astro'

// Force dynamic rendering
export const prerender = false

// Add cache control header
export const GET: APIRoute = async ({ request }) => {
  console.log('[API] Latest post request received:', new Date().toISOString())
  
  const username = import.meta.env.BLUESKY_USERNAME
  const password = import.meta.env.BLUESKY_APP_PASSWORD

  console.log('[API] Checking credentials:', { hasUsername: !!username, hasPassword: !!password })

  if (!username || !password) {
    console.error('[API] Missing credentials')
    return new Response(
      JSON.stringify({ 
        error: 'Bluesky credentials not configured',
        serverTime: new Date().toISOString()
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

    console.log('[API] Fetching author feed')
    const response = await agent.getAuthorFeed({ actor: username, limit: 1 })
    const latestPost = response.data.feed[0]?.post ?? null

    console.log('[API] Post details:', {
      text: latestPost?.record?.text,
      createdAt: latestPost?.record?.createdAt,
      indexedAt: latestPost?.indexedAt,
      serverTime: new Date().toISOString()
    })

    const responseBody = { 
      post: latestPost, 
      timestamp: Date.now(),
      serverTime: new Date().toISOString()
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
        serverTime: new Date().toISOString()
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
