#!/usr/bin/env bun
/**
 * Database ping script
 * Checks database connectivity from the command line
 *
 * Usage: bun run db:ping
 */

import { checkDbHealth, closeDbClient } from '../lib/db/client'

async function main() {
    console.log('🔍 Checking database connectivity...\n')

    try {
        const health = await checkDbHealth()

        if (health.connected) {
            console.log('✅ Database connection successful!')
            console.log(`   Latency: ${health.latency}ms`)
        } else {
            console.error('❌ Database connection failed!')
            console.error(`   Error: ${health.error}`)
            process.exit(1)
        }
    } catch (error) {
        console.error('❌ Failed to check database health:')
        console.error(error instanceof Error ? error.message : error)
        process.exit(1)
    } finally {
        await closeDbClient()
    }
}

main()
