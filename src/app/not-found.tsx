import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Custom 404 Not Found page
 * Displayed when a route does not exist
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="text-center">
                <h1 className="mb-2 text-9xl font-bold text-primary/20">404</h1>
                <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
                    deleted.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
