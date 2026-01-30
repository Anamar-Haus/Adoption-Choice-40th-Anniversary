// Test setup file for Vitest
// This file runs before all tests

import { afterAll, afterEach, beforeAll } from 'vitest'

// Global setup
beforeAll(() => {
    // Set test environment variables
    (process.env as Record<string, string>).NODE_ENV = 'test'
})

// Cleanup after each test
afterEach(() => {
    // Reset any mocks or state between tests
})

// Cleanup after all tests
afterAll(() => {
    // Clean up any resources
})
