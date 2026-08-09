import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { dirname } from 'node:path'
import { mkdirSync } from 'node:fs'
import * as schema from '../db/schema'

const databasePath = process.env.NUXT_QUIZ_DATABASE_PATH ?? '.data/quiz-progress.sqlite'
mkdirSync(dirname(databasePath), { recursive: true })

const sqlite = new Database(databasePath)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')
sqlite.pragma('busy_timeout = 5000')
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    last_login_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS quiz_progress (
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    state_json TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, quiz_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

export const db = drizzle(sqlite, { schema })
