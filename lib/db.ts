import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { pool?: Pool }
export const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: { rejectUnauthorized: false } })
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool
