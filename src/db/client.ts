import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Create a connection pool with individual parameters for better control
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number.parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Log connection info (except password) for debugging
console.log('Connecting to database:', {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || '5432',
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    ssl: process.env.NODE_ENV === 'production',
})

// Create the Drizzle client
export const db = drizzle(pool, { schema })

// Export types
export type DbClient = typeof db

// For testing purposes
export const closePool = async () => {
    console.log('Closing database connection pool...')
    await pool.end()
}
