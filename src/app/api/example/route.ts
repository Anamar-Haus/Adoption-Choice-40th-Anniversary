import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createRateLimiter, checkRateLimit, RateLimitConfigs } from '@/lib/security/rate-limit'
import { validateBody, validateQuery } from '@/lib/security/validation'
import { createSuccessResponse } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

/**
 * Example API Route
 *
 * Demonstrates:
 * - Rate limiting on GET and POST endpoints
 * - Input validation with Zod
 * - Proper error responses
 * - Request logging
 */

// Create rate limiters for different endpoints
const getEndpointLimiter = createRateLimiter(RateLimitConfigs.standard)
const postEndpointLimiter = createRateLimiter(RateLimitConfigs.strict)

/**
 * GET /api/example
 *
 * Example GET endpoint with rate limiting and query validation
 *
 * Query Parameters:
 * - name (optional): Name to greet
 * - count (optional): Number of times to repeat (1-10)
 */
export async function GET(request: NextRequest) {
    const requestId = request.headers.get('x-request-id') || undefined
    const logger = createLogger({ requestId, endpoint: 'GET /api/example' })

    // Check rate limit
    const rateLimitResponse = await checkRateLimit(request, getEndpointLimiter)
    if (rateLimitResponse) {
        logger.warn('Rate limit exceeded')
        return rateLimitResponse
    }

    // Validate query parameters
    const querySchema = z.object({
        name: z.string().min(1).max(100).optional().default('World'),
        count: z.coerce.number().int().min(1).max(10).optional().default(1),
    })

    const result = validateQuery(request, querySchema)
    if (!result.success) {
        logger.warn('Validation failed')
        return result.response
    }

    const { name, count } = result.data
    logger.info('Processing request', { name, count })

    // Generate response
    const greetings = Array(count)
        .fill(null)
        .map((_, i) => `Hello, ${name}! (${i + 1})`)

    return createSuccessResponse(
        {
            greetings,
            timestamp: new Date().toISOString(),
        },
        200,
        requestId
    )
}

/**
 * POST /api/example
 *
 * Example POST endpoint with rate limiting and body validation
 *
 * Request Body:
 * - title (required): Title string (1-200 chars)
 * - description (optional): Description string (max 1000 chars)
 * - priority (optional): Priority level (low, medium, high)
 */
export async function POST(request: NextRequest) {
    const requestId = request.headers.get('x-request-id') || undefined
    const logger = createLogger({ requestId, endpoint: 'POST /api/example' })

    // Check rate limit (stricter for POST endpoints)
    const rateLimitResponse = await checkRateLimit(request, postEndpointLimiter)
    if (rateLimitResponse) {
        logger.warn('Rate limit exceeded')
        return rateLimitResponse
    }

    // Validate request body
    const bodySchema = z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    })

    const result = await validateBody(request, bodySchema)
    if (!result.success) {
        logger.warn('Validation failed')
        return result.response
    }

    const { title, description, priority } = result.data
    logger.info('Creating item', { title, priority })

    // Simulate creating a resource
    const newItem = {
        id: `item-${Date.now()}`,
        title,
        description: description || null,
        priority,
        createdAt: new Date().toISOString(),
    }

    return createSuccessResponse(newItem, 201, requestId)
}
