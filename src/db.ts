import { PrismaClient } from './generated/prisma/client.js'

import { env } from '#/env'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './db/schema.js'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool, {
  schema: new URL(env.DATABASE_URL).searchParams.get('schema') ?? 'public',
})

declare global {
  var __prisma: PrismaClient | undefined
  var __pool: Pool | undefined
  var __db: ReturnType<typeof drizzle> | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })
export const db =
  globalThis.__db || drizzle({ client: pool, schema })

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
  globalThis.__pool = pool
  globalThis.__db = db
}

export { pool }
export * from './db/schema.js'
