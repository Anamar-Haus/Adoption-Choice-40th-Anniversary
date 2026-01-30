import { query } from './client'

/**
 * Database query helpers
 *
 * Security Note: All queries use parameterized statements to prevent SQL injection.
 * Never construct queries by concatenating user input with SQL strings.
 */

// Example query helper - customize as needed for your schema
export interface ExampleRecord {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

/**
 * Find a record by ID
 * Example of a parameterized query
 */
export async function findById(table: string, id: string): Promise<ExampleRecord | null> {
    // Note: Table names cannot be parameterized, so validate them against a whitelist
    const allowedTables = ['users', 'projects', 'settings']
    if (!allowedTables.includes(table)) {
        throw new Error(`Invalid table name: ${table}`)
    }

    const rows = await query<ExampleRecord>(
        `SELECT * FROM ${table} WHERE id = $1 LIMIT 1`,
        [id]
    )

    return rows[0] || null
}

/**
 * Count records in a table
 */
export async function countRecords(table: string): Promise<number> {
    const allowedTables = ['users', 'projects', 'settings']
    if (!allowedTables.includes(table)) {
        throw new Error(`Invalid table name: ${table}`)
    }

    const rows = await query<{ count: string }>(
        `SELECT COUNT(*) as count FROM ${table}`,
        []
    )

    return parseInt(rows[0]?.count || '0', 10)
}
