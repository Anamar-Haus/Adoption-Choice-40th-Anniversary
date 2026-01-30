import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import {
    validateBody,
    validateQuery,
    validateParams,
    CommonSchemas,
} from '@/lib/security/validation'

/**
 * Validation Tests
 *
 * These tests validate the input validation module.
 */

describe('Validation Helpers', () => {
    describe('validateBody', () => {
        test('validates valid JSON body', async () => {
            const schema = z.object({
                name: z.string(),
                email: z.string().email(),
            })

            const body = { name: 'Test User', email: 'test@example.com' }
            const request = new NextRequest('http://localhost/api/test', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await validateBody(request, schema)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.name).toBe('Test User')
                expect(result.data.email).toBe('test@example.com')
            }
        })

        test('returns error for invalid body', async () => {
            const schema = z.object({
                email: z.string().email(),
            })

            const body = { email: 'not-an-email' }
            const request = new NextRequest('http://localhost/api/test', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await validateBody(request, schema)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.response.status).toBe(400)
            }
        })

        test('returns error for invalid JSON', async () => {
            const schema = z.object({ name: z.string() })

            const request = new NextRequest('http://localhost/api/test', {
                method: 'POST',
                body: 'not-json',
                headers: { 'Content-Type': 'application/json' },
            })

            const result = await validateBody(request, schema)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.response.status).toBe(400)
            }
        })
    })

    describe('validateQuery', () => {
        test('validates valid query parameters', () => {
            const schema = z.object({
                page: z.coerce.number().int().min(1),
                limit: z.coerce.number().int().min(1).max(100),
            })

            const request = new NextRequest('http://localhost/api/test?page=1&limit=20')

            const result = validateQuery(request, schema)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.page).toBe(1)
                expect(result.data.limit).toBe(20)
            }
        })

        test('returns error for invalid query parameters', () => {
            const schema = z.object({
                page: z.coerce.number().int().min(1),
            })

            const request = new NextRequest('http://localhost/api/test?page=invalid')

            const result = validateQuery(request, schema)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.response.status).toBe(400)
            }
        })
    })

    describe('validateParams', () => {
        test('validates valid route parameters', () => {
            const schema = z.object({
                id: z.string().uuid(),
            })

            const params = { id: '550e8400-e29b-41d4-a716-446655440000' }

            const result = validateParams(params, schema)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.id).toBe('550e8400-e29b-41d4-a716-446655440000')
            }
        })

        test('returns error for invalid route parameters', () => {
            const schema = z.object({
                id: z.string().uuid(),
            })

            const params = { id: 'not-a-uuid' }

            const result = validateParams(params, schema)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.response.status).toBe(400)
            }
        })
    })

    describe('CommonSchemas', () => {
        test('uuid validates correctly', () => {
            fc.assert(
                fc.property(fc.uuid(), (uuid) => {
                    const result = CommonSchemas.uuid.safeParse(uuid)
                    expect(result.success).toBe(true)
                }),
                { numRuns: 100 }
            )
        })

        test('email validates correctly', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom('test@example.com', 'user@domain.org', 'admin@test.io'),
                    (email) => {
                        const result = CommonSchemas.email.safeParse(email)
                        expect(result.success).toBe(true)
                    }
                ),
                { numRuns: 100 }
            )
        })

        test('pagination has default values', () => {
            const result = CommonSchemas.pagination.parse({})
            expect(result.page).toBe(1)
            expect(result.limit).toBe(20)
        })
    })
})
