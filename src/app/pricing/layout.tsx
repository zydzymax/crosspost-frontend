import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Тарифы Crosspost | Выберите план подписки',
  description: 'Простые и прозрачные тарифы кросспостинга. Demo (7 дней бесплатно), Pro (990 руб/мес), Business (2990 руб/мес). Отмена в любой момент.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Тарифы Crosspost | Выберите план подписки',
    description: 'Простые и прозрачные тарифы. Pro от 990 руб/мес. Все платформы, AI-капшены, генерация картинок.',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
