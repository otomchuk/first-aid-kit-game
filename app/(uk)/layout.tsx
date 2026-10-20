import type { Metadata, Viewport } from 'next'
import { SiteDocument } from '@/components/site/site-document'
import { COPY } from '@/lib/i18n'

export const metadata: Metadata = {
  title: COPY.uk.metadata.title,
  description: COPY.uk.metadata.description,
  generator: 'v0.app',
  alternates: {
    languages: {
      uk: '/',
      en: '/en/',
    },
  },
  icons: {
    icon: [
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icon-light-32x32-10.png`, media: '(prefers-color-scheme: light)' },
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icon-dark-32x32-10.png`, media: '(prefers-color-scheme: dark)' },
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icon-10.svg`, type: 'image/svg+xml' },
    ],
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/apple-icon-10.png`,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#001427',
}

export default function UkrainianLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument locale="uk">{children}</SiteDocument>
}
