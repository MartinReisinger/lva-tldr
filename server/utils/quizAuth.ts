import type { H3Event } from 'h3'

export function isQuizSyncConfigured() {
  return Boolean(
    process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID
    && process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET
    && process.env.NUXT_SESSION_PASSWORD,
  )
}

export async function requireQuizUser(event: H3Event) {
  if (!isQuizSyncConfigured()) {
    throw createError({ statusCode: 404, statusMessage: 'Quiz sync is not configured' })
  }
  const session = await requireUserSession(event)
  return session.user
}
