import { Agent, CredentialSession } from '@atproto/api'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  console.log('[API] Latest post request received')
  
  const username = import.meta.env.BLUESKY_USERNAME
  const password = import.meta.env.BLUESKY_APP_PASSWORD

  console.log('[API] Checking credentials:', { hasUsername: !!username, hasPassword: !!password })

  if (!username || !password) {
    console.error('[API] Missing credentials')
    return new Response(
      JSON.stringify({ error: 'Bluesky credentials not configured' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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

    console.log('[API] Post fetched successfully:', { hasPost: !!latestPost })

    return new Response(
      JSON.stringify({ post: latestPost }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    console.error('[API] Error:', error)
    return new Response(
      JSON.stringify({ error }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}
