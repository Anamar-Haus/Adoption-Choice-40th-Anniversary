import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
