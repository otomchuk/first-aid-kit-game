import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { asset } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Збери аптечку — гра на підтримку збору IFAK для захисників',
  description:
    'Спакуй турнікет, гемостатик, бандаж та інше спорядження в тактичну аптечку і підтримай збір на IFAK для військових.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: asset('/icon-light-32x32-10.png'), media: '(prefers-color-scheme: light)' },
      { url: asset('/icon-dark-32x32-10.png'), media: '(prefers-color-scheme: dark)' },
      { url: asset('/icon-10.svg'), type: 'image/svg+xml' },
    ],
    apple: asset('/apple-icon-v2-10.png'),
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1c14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${oswald.variable}`}>
      <body className="antialiased">
        {children}
        {/* Cloudflare Web Analytics */}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e1c0e6d47ac043eea07d5b21cd2ef172"}'
        />
        {/* End Cloudflare Web Analytics */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
