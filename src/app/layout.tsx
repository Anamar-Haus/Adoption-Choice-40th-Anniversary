import type { Metadata, Viewport } from 'next'
import { Comfortaa, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'

const comfortaa = Comfortaa({
  variable: '--font-comfortaa',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// SEO-friendly metadata defaults using Next.js metadata API
// Update these values with your actual site information
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: 'Our History | Adoption Choice Inc.',
    template: '%s | Adoption Choice Inc.',
  },
  description:
    'Celebrating nearly 40 years of building loving families through adoption in Wisconsin. Adoption Choice, Inc. is a fully licensed non-profit adoption agency serving all 72 Wisconsin counties.',
  keywords: [
    'Adoption',
    'Wisconsin',
    'Adoption Agency',
    'Non-Profit',
    'Family',
    'Birth Parents',
    'Adoptive Families',
  ],

  // Canonical URL placeholder - update with your domain
  metadataBase: new URL(siteUrl),

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Adoption Choice Inc.',
    title: 'Our History | Adoption Choice Inc.',
    description:
      'Celebrating nearly 40 years of building loving families through adoption. A fully licensed non-profit adoption agency serving all of Wisconsin.',
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Our History | Adoption Choice Inc.',
    description:
      'Celebrating nearly 40 years of building loving families through adoption. A fully licensed non-profit adoption agency serving all of Wisconsin.',
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional metadata
  authors: [{ name: 'Adoption Choice Inc.' }],
  creator: 'Adoption Choice Inc.',
  publisher: 'Adoption Choice Inc.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script defer src="https://cloud.umami.is/script.js" data-website-id="f93372c8-76dd-4d6e-a683-3a735e6e965a"></Script>
      <body className={`${comfortaa.variable} ${geistMono.variable} antialiased font-comfortaa`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
