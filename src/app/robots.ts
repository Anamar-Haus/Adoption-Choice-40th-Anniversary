import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adoption-choice-40th-anniversary.vercel.app'

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
