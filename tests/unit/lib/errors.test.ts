import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import {
    createErrorResponse,
    createSuccessResponse,
    AppError,
    Errors,
    ErrorCodes,
} from '@/lib/errors'

/**
 * Error Handling Tests
 *
 * These tests validate the error handling module using property-based testing.
 */

describe('Error Handling', () => {
    // Feature: nextjs-seo-toolkit, Property 2: Error Response Consistency
    describe('Property 2: Error Response Consistency', () => {
        test('all error responses have consistent structure', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        code: fc.string({ minLength: 1, maxLength: 50 }),
                        message: fc.string({ minLength: 1, maxLength: 200 }),
                        status: fc.integer({ min: 400, max: 599 }),
                    }),
                    async ({ code, message, status }) => {
                        const response = createErrorResponse(code, message, status)

                        // Verify response status
                        expect(response.status).toBe(status)

                        // Verify content type
                        expect(response.headers.get('Content-Type')).toBe('application/json')

                        // Verify request ID header
                        expect(response.headers.has('X-Request-ID')).toBe(true)

                        // Parse and verify body structure
                        const body = await response.json()

                        // Must have 'error' key
                        expect(body).toHaveProperty('error')

                        // Error must have required fields
                        expect(body.error).toHaveProperty('code')
                        expect(body.error).toHaveProperty('message')
                        expect(body.error).toHaveProperty('requestId')

                        // Values should match
                        expect(body.error.code).toBe(code)
                        expect(body.error.message).toBe(message)
                        expect(typeof body.error.requestId).toBe('string')
                    }
                ),
                { numRuns: 100 }
            )
        })

        test('uses provided requestId when given', async () => {
            const customRequestId = 'custom-request-id-123'
            const response = createErrorResponse('TEST', 'Test error', 400, customRequestId)

            const body = await response.json()
            expect(body.error.requestId).toBe(customRequestId)
            expect(response.headers.get('X-Request-ID')).toBe(customRequestId)
        })

        test('generates requestId when not provided', async () => {
            const response = createErrorResponse('TEST', 'Test error')

            const body = await response.json()
            expect(body.error.requestId).toBeDefined()
            expect(body.error.requestId.length).toBeGreaterThan(0)
        })
    })

    describe('Error Response Details in Development', () => {
        const originalEnv = process.env.NODE_ENV

        beforeEach(() => {
            vi.stubEnv('NODE_ENV', 'development')
        })

        afterEach(() => {
            vi.stubEnv('NODE_ENV', originalEnv || 'test')
        })

        test('includes details in development mode', async () => {
            const details = { field: 'email', issue: 'invalid format' }
            const response = createErrorResponse('VALIDATION', details, 400)

            const body = await response.json()
            expect(body.error.details).toEqual(details)
        })
    })

    describe('createSuccessResponse', () => {
        test('returns data in consistent format', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        id: fc.uuid(),
                        name: fc.string({ minLength: 1 }),
                        count: fc.integer(),
                    }),
                    async (data) => {
                        const response = createSuccessResponse(data)

                        expect(response.status).toBe(200)
                        expect(response.headers.get('Content-Type')).toBe('application/json')

                        const body = await response.json()
                        expect(body).toHaveProperty('data')
                        expect(body.data).toEqual(data)
                    }
                ),
                { numRuns: 100 }
            )
        })

        test('respects custom status code', async () => {
            const response = createSuccessResponse({ created: true }, 201)
            expect(response.status).toBe(201)
        })
    })

    describe('AppError class', () => {
        test('creates error with correct properties', () => {
            const error = new AppError('TEST_ERROR', 'Test message', 400)

            expect(error.code).toBe('TEST_ERROR')
            expect(error.message).toBe('Test message')
            expect(error.statusCode).toBe(400)
            expect(error.name).toBe('AppError')
        })

        test('converts to Response correctly', async () => {
            const error = new AppError('TEST_ERROR', 'Test message', 400)
            const response = error.toResponse('req-123')

            expect(response.status).toBe(400)

            const body = await response.json()
            expect(body.error.code).toBe('TEST_ERROR')
            expect(body.error.message).toBe('Test message')
            expect(body.error.requestId).toBe('req-123')
        })
    })

    describe('Error shortcuts', () => {
        test('Errors.validation returns 400', async () => {
            const response = Errors.validation({ field: 'email' })
            expect(response.status).toBe(400)

            const body = await response.json()
            expect(body.error.code).toBe(ErrorCodes.VALIDATION_ERROR)
        })

        test('Errors.unauthorized returns 401', async () => {
            const response = Errors.unauthorized()
            expect(response.status).toBe(401)

            const body = await response.json()
            expect(body.error.code).toBe(ErrorCodes.UNAUTHORIZED)
        })

        test('Errors.forbidden returns 403', async () => {
            const response = Errors.forbidden()
            expect(response.status).toBe(403)

            const body = await response.json()
            expect(body.error.code).toBe(ErrorCodes.FORBIDDEN)
        })

        test('Errors.notFound returns 404', async () => {
            const response = Errors.notFound()
            expect(response.status).toBe(404)

            const body = await response.json()
            expect(body.error.code).toBe(ErrorCodes.NOT_FOUND)
        })

        test('Errors.rateLimit returns 429 with Retry-After', async () => {
            const response = Errors.rateLimit(60)
            expect(response.status).toBe(429)
            expect(response.headers.get('Retry-After')).toBe('60')
        })
    })
})
