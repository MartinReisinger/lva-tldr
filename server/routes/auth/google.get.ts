import { users } from '../../db/schema'

export default defineEventHandler((event) => {
  if (!isQuizSyncConfigured()) {
    throw createError({ statusCode: 404, statusMessage: 'Google sync is not configured' })
  }

  return defineOAuthGoogleEventHandler({
    config: { scope: ['openid', 'email', 'profile'] },
    async onSuccess(event, { user }) {
      if (!user.sub || !user.email) {
        return sendRedirect(event, '/computer-graphics/quiz?login=failed')
      }

      const now = new Date().toISOString()
      await db.insert(users).values({
        id: user.sub,
        email: user.email,
        name: user.name || user.email,
        avatarUrl: user.picture,
        createdAt: now,
        lastLoginAt: now,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          name: user.name || user.email,
          avatarUrl: user.picture,
          lastLoginAt: now,
        },
      })

      await setUserSession(event, {
        user: {
          id: user.sub,
          email: user.email,
          name: user.name || user.email,
          avatar: user.picture,
        },
      })
      return sendRedirect(event, '/computer-graphics/quiz')
    },
    onError(event) {
      return sendRedirect(event, '/computer-graphics/quiz?login=failed')
    },
  })(event)
})
