import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull(),
  lastLoginAt: text('last_login_at').notNull(),
})

export const quizProgress = sqliteTable('quiz_progress', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id').notNull(),
  stateJson: text('state_json').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: text('updated_at').notNull(),
}, table => [primaryKey({ columns: [table.userId, table.quizId] })])
