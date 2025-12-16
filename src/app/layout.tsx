import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales Whisper Crosspost | Автоматический кросспостинг',
  description: 'Автоматизируйте публикации в социальных сетях. VK, Telegram, Instagram, TikTok, YouTube - один контент, все платформы.',
  keywords: 'кросспостинг, автопостинг, SMM, социальные сети, VK, Telegram, Instagram, TikTok, YouTube',
  authors: [{ name: 'Sales Whisper' }],
  metadataBase: new URL('https://crosspost.saleswhisper.pro'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sales Whisper Crosspost',
    description: 'Автоматический кросспостинг в социальные сети. VK, Telegram, Instagram, TikTok, YouTube - один контент, все платформы.',
    url: 'https://crosspost.saleswhisper.pro',
    siteName: 'Sales Whisper Crosspost',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sales Whisper Crosspost - автоматический кросспостинг',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Whisper Crosspost',
    description: 'Автоматический кросспостинг в социальные сети',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sales Whisper Crosspost',
  description: 'Автоматический кросспостинг в социальные сети. VK, Telegram, Instagram, TikTok, YouTube.',
  url: 'https://crosspost.saleswhisper.pro',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'RUB',
    lowPrice: '0',
    highPrice: '2990',
    offers: [
      {
        '@type': 'Offer',
        name: 'Demo',
        price: '0',
        priceCurrency: 'RUB',
        description: '7 дней бесплатно',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '990',
        priceCurrency: 'RUB',
        description: 'Для активных авторов и SMM',
      },
      {
        '@type': 'Offer',
        name: 'Business',
        price: '2990',
        priceCurrency: 'RUB',
        description: 'Для агентств и команд',
      },
    ],
  },
  publisher: {
    '@type': 'Organization',
    name: 'Sales Whisper',
    url: 'https://saleswhisper.pro',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
