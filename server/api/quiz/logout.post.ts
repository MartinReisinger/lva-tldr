export default defineEventHandler(async (event) => {
  if (isQuizSyncConfigured()) await clearUserSession(event)
  return { ok: true }
})
