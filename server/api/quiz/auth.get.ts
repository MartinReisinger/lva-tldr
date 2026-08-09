export default defineEventHandler(async (event) => {
  if (!isQuizSyncConfigured()) return { enabled: false, user: null }
  const session = await getUserSession(event)
  return { enabled: true, user: session.user ?? null }
})
