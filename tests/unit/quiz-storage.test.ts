import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { and, eq } from 'drizzle-orm'
import { readFileSync, readdirSync } from 'node:fs'
import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { quizProgress, users } from '../../server/db/schema'

const sqlite = new Database(':memory:')
sqlite.pragma('foreign_keys = ON')
for (const migration of readdirSync('server/db/migrations').filter(name => name.endsWith('.sql')).sort()) {
  sqlite.exec(readFileSync(`server/db/migrations/${migration}`, 'utf8'))
}
const database = drizzle(sqlite)

afterAll(() => sqlite.close())

afterEach(() => {
  database.delete(quizProgress).run()
  database.delete(users).run()
})

describe('quiz progress storage', () => {
  it('stores independent progress per Google user and quiz', () => {
    const now = new Date().toISOString()
    database.insert(users).values([
      { id: 'google-a', email: 'a@example.com', name: 'A', createdAt: now, lastLoginAt: now },
      { id: 'google-b', email: 'b@example.com', name: 'B', createdAt: now, lastLoginAt: now },
    ]).run()
    database.insert(quizProgress).values([
      { userId: 'google-a', quizId: 'computer-graphics', stateJson: '{"a":1}', updatedAt: now },
      { userId: 'google-b', quizId: 'computer-graphics', stateJson: '{"b":1}', updatedAt: now },
      { userId: 'google-a', quizId: 'another-quiz', stateJson: '{"c":1}', updatedAt: now },
    ]).run()

    const row = database.select().from(quizProgress).where(and(
      eq(quizProgress.userId, 'google-a'),
      eq(quizProgress.quizId, 'computer-graphics'),
    )).get()
    expect(row?.stateJson).toBe('{"a":1}')
    expect(database.select().from(quizProgress).all()).toHaveLength(3)
  })

  it('deletes a user’s synchronized progress with the account row', () => {
    const now = new Date().toISOString()
    database.insert(users).values({
      id: 'google-a', email: 'a@example.com', name: 'A', createdAt: now, lastLoginAt: now,
    }).run()
    database.insert(quizProgress).values({
      userId: 'google-a', quizId: 'computer-graphics', stateJson: '{}', updatedAt: now,
    }).run()

    database.delete(users).where(eq(users.id, 'google-a')).run()
    expect(database.select().from(quizProgress).all()).toEqual([])
  })
})
