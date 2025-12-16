import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в Crosspost | Авторизация через Telegram',
  description: 'Войдите в личный кабинет Crosspost через Telegram. Управляйте всеми социальными сетями из одного места.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
