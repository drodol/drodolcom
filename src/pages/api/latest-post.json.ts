import { Agent, CredentialSession } from '@atproto/api'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const username = import.meta.env.BLUESKY_USERNAME
  const password = import.meta.env.BLUESKY_APP_PASSWORD

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: 'Bluesky credentials not configured' }),
      { status: 500 }
    )
  }

  try {
    const session = new CredentialSession(new URL('https://bsky.social'), undefined, undefined)
    const agent = new Agent(session)

    await session.login({
      identifier: username,
      password: password
    })

    const response = await agent.getAuthorFeed({ actor: username, limit: 1 })
    const latestPost = response.data.feed[0]?.post ?? null

    return new Response(
      JSON.stringify({ post: latestPost }),
      { status: 200 }
    )
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error }),
      { status: 500 }
    )
  }
}
