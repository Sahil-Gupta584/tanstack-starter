import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './db/schema.js'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

declare global {
  var __pool: Pool | undefined
  var __db: ReturnType<typeof drizzle> | undefined
}

export const db = globalThis.__db || drizzle({ client: pool, schema })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pool = pool
  globalThis.__db = db
}

export { pool }
export * from './db/schema.js'
