import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Подключение облачного хранилища | Crosspost',
  description: 'Пошаговая инструкция подключения Google Drive и Яндекс.Диска к Crosspost. Автоматическая синхронизация и адаптация медиа для всех соцсетей.',
  alternates: {
    canonical: '/guide/cloud-storage',
  },
  openGraph: {
    title: 'Подключение облачного хранилища | Crosspost',
    description: 'Подключите Google Drive или Яндекс.Диск. Автоматическая синхронизация и адаптация медиа.',
  },
}

export default function CloudStorageGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
