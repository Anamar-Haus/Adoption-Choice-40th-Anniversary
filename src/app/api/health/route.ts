import { NextResponse } from 'next/server'
import { checkDbHealth } from '@/lib/db/client'

/**
 * Health check endpoint
 * GET /api/health
 *
 * Returns the health status of the application and its dependencies
 * Used by load balancers, monitoring systems, and deployment pipelines
 */
export async function GET() {
    const timestamp = new Date().toISOString()

    // Check database connectivity
    const dbHealth = await checkDbHealth()

    // Determine overall status
    const status = dbHealth.connected ? 'ok' : 'error'

    const response = {
        status,
        timestamp,
        database: {
            connected: dbHealth.connected,
            latency: dbHealth.latency,
        },
    }

    // Return 503 if any critical dependencies are unhealthy
    if (status === 'error') {
        return NextResponse.json(response, { status: 503 })
    }

    return NextResponse.json(response, { status: 200 })
}
