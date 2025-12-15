import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales Whisper Crosspost | Автоматический кросспостинг',
  description: 'Автоматизируйте публикации в социальных сетях. VK, Telegram, Instagram, TikTok, YouTube - один контент, все платформы.',
  keywords: 'кросспостинг, автопостинг, SMM, социальные сети, VK, Telegram, Instagram, TikTok, YouTube',
  authors: [{ name: 'Sales Whisper' }],
  openGraph: {
    title: 'Sales Whisper Crosspost',
    description: 'Автоматический кросспостинг в социальные сети',
    url: 'https://crosspost.saleswhisper.pro',
    siteName: 'Sales Whisper Crosspost',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  )
}
