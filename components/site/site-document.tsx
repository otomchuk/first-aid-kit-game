import { Analytics } from '@vercel/analytics/next'
import { Inter, Oswald } from 'next/font/google'
import type { Locale } from '@/lib/i18n'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-oswald' })

export function SiteDocument({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  return (
    <html lang={locale} className={`${inter.variable} ${oswald.variable}`}>
      <body className="antialiased">
        {children}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e1c0e6d47ac043eea07d5b21cd2ef172"}'
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
