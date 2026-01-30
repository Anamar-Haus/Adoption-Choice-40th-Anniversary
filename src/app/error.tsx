'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Global error boundary
 * Catches errors in the application and displays a user-friendly error page
 *
 * Security Note: Stack traces are only shown in development mode
 * In production, users see a generic error message without sensitive details
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        // In production, integrate with your error tracking service (e.g., Sentry)
        console.error('Application error:', error)
    }, [error])

    const isDev = process.env.NODE_ENV === 'development'

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 text-6xl">⚠️</div>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription>
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Only show error details in development */}
                    {isDev && (
                        <div className="rounded-md bg-destructive/10 p-4">
                            <p className="mb-2 font-medium text-destructive">Error Details (Dev Only):</p>
                            <code className="text-sm">{error.message}</code>
                            {error.digest && (
                                <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
                            )}
                        </div>
                    )}

                    {/* Production-safe error reference */}
                    {!isDev && error.digest && (
                        <p className="text-center text-sm text-muted-foreground">
                            Error Reference: {error.digest}
                        </p>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button onClick={reset} className="flex-1">
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (window.location.href = '/')}
                            className="flex-1"
                        >
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
