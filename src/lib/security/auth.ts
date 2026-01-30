/**
 * Authentication Placeholders Module
 *
 * This module provides authentication utilities for development.
 * In production, replace these with real authentication (e.g., NextAuth, Clerk, Auth0).
 *
 * Security Note: The mock user is ONLY returned in development mode.
 * In production, requireUser() will throw an error until real auth is configured.
 */

/**
 * User type definition
 * Extend this based on your actual user model
 */
export interface User {
    id: string
    email: string
    name: string
    role?: 'user' | 'admin'
    createdAt?: Date
}

/**
 * Authentication error class
 */
export class AuthError extends Error {
    constructor(
        message: string,
        public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'SESSION_EXPIRED' = 'UNAUTHORIZED'
    ) {
        super(message)
        this.name = 'AuthError'
    }
}

/**
 * Mock user for development
 */
const MOCK_USER: User = {
    id: 'dev-user-1',
    email: 'dev@example.com',
    name: 'Development User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
}

/**
 * Require an authenticated user
 *
 * In development: Returns a mock user for testing
 * In production: Throws AuthError until real auth is configured
 *
 * Usage:
 * ```
 * const user = await requireUser()
 * // user is guaranteed to be authenticated
 * ```
 *
 * @returns The authenticated user
 * @throws AuthError if user is not authenticated
 */
export async function requireUser(): Promise<User> {
    // In development, return mock user
    if (process.env.NODE_ENV === 'development') {
        // Simulate async auth check
        await new Promise((resolve) => setTimeout(resolve, 10))
        return MOCK_USER
    }

    // TODO: Implement real authentication
    // Example with NextAuth:
    // const session = await getServerSession(authOptions)
    // if (!session?.user) {
    //   throw new AuthError('Authentication required')
    // }
    // return session.user

    // In production without real auth, throw error
    throw new AuthError(
        'Authentication not configured. Implement real authentication for production.',
        'UNAUTHORIZED'
    )
}

/**
 * Get the current user if authenticated, or null if not
 *
 * Unlike requireUser(), this doesn't throw an error for unauthenticated users.
 *
 * Usage:
 * ```
 * const user = await getOptionalUser()
 * if (user) {
 *   // User is authenticated
 * } else {
 *   // User is a guest
 * }
 * ```
 *
 * @returns The authenticated user or null
 */
export async function getOptionalUser(): Promise<User | null> {
    try {
        return await requireUser()
    } catch {
        return null
    }
}

/**
 * Require a user with a specific role
 *
 * @param requiredRole - The minimum role required
 * @returns The authenticated user
 * @throws AuthError if user doesn't have the required role
 */
export async function requireRole(requiredRole: 'user' | 'admin'): Promise<User> {
    const user = await requireUser()

    // Admin has access to everything
    if (user.role === 'admin') {
        return user
    }

    // Non-admin users can only access 'user' role
    if (requiredRole === 'admin') {
        throw new AuthError('Admin access required', 'FORBIDDEN')
    }

    return user
}

/**
 * Check if the current request is authenticated
 *
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getOptionalUser()
    return user !== null
}
