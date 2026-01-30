import { Pool, PoolClient } from 'pg'
import { env } from '@/lib/env'
import { createLogger } from '@/lib/logger'

const logger = createLogger({ module: 'db' })

/**
 * Global database pool instance
 * Uses singleton pattern to reuse connections across requests
 */
let pool: Pool | null = null

/**
 * Get the database connection pool
 * Creates a new pool if one doesn't exist
 *
 * Security Note: Connection pooling helps prevent connection exhaustion
 * attacks and improves performance
 */
export function getDbClient(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: env.DATABASE_URL,
            // Connection pool settings
            max: 20, // Maximum number of connections
            idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
            connectionTimeoutMillis: 5000, // Timeout after 5 seconds if can't connect
        })

        // Log connection errors
        pool.on('error', (err) => {
            logger.error('Unexpected database pool error', { error: err.message })
        })

        pool.on('connect', () => {
            logger.debug('New database connection established')
        })

        logger.info('Database connection pool created')
    }

    return pool
}

/**
 * Close the database connection pool
 * Call this when shutting down the application
 */
export async function closeDbClient(): Promise<void> {
    if (pool) {
        await pool.end()
        pool = null
        logger.info('Database connection pool closed')
    }
}

/**
 * Execute a database query
 *
 * Security Note: Always use parameterized queries to prevent SQL injection
 * Never interpolate user input directly into query strings
 *
 * @param text - SQL query with $1, $2, etc. placeholders
 * @param params - Array of parameter values
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
    const client = getDbClient()
    const start = Date.now()

    try {
        const result = await client.query(text, params)
        const duration = Date.now() - start

        logger.debug('Query executed', {
            query: text.substring(0, 100), // Log first 100 chars only
            duration,
            rows: result.rowCount,
        })

        return result.rows as T[]
    } catch (error) {
        logger.error('Query failed', {
            query: text.substring(0, 100),
            error: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
    }
}

/**
 * Check database connectivity
 * Used by the health endpoint to verify database status
 */
export async function checkDbHealth(): Promise<{
    connected: boolean
    latency?: number
    error?: string
}> {
    const start = Date.now()

    try {
        const client = getDbClient()
        const result = await client.query('SELECT 1 as health')
        const latency = Date.now() - start

        if (result.rows[0]?.health === 1) {
            return { connected: true, latency }
        }

        return { connected: false, error: 'Unexpected query result' }
    } catch (error) {
        logger.error('Database health check failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
        })
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Connection failed',
        }
    }
}

/**
 * Execute a function within a database transaction
 *
 * @param fn - Async function to execute within the transaction
 * @returns The result of the function
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await getDbClient().connect()

    try {
        await client.query('BEGIN')
        const result = await fn(client)
        await client.query('COMMIT')
        return result
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
