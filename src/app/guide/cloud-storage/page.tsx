'use client'

import Link from 'next/link'
import {
  Cloud, FolderOpen, Video, Image, Check, ArrowRight,
  Link2, RefreshCw, Shield, Zap, HardDrive, ChevronRight,
  Copy, ExternalLink, AlertCircle, CheckCircle2
} from 'lucide-react'
import { useState } from 'react'

const steps = {
  yandex: [
    {
      title: 'Создайте папку на Яндекс.Диске',
      description: 'Откройте Яндекс.Диск и создайте новую папку для вашего контента',
      icon: FolderOpen,
    },
    {
      title: 'Создайте подпапки videos и photos',
      description: 'Внутри созданной папки создайте две подпапки: videos для видео и photos для изображений',
      icon: FolderOpen,
    },
    {
      title: 'Загрузите ваши медиафайлы',
      description: 'Разложите файлы по соответствующим папкам. Видео в videos/, фото в photos/',
      icon: Video,
    },
    {
      title: 'Сделайте папку публичной',
      description: 'Нажмите правой кнопкой на папку → "Поделиться" → скопируйте публичную ссылку',
      icon: Link2,
    },
    {
      title: 'Подключите в Crosspost',
      description: 'Вставьте ссылку в разделе "Облачные хранилища" и нажмите "Подключить"',
      icon: Cloud,
    },
  ],
  google: [
    {
      title: 'Создайте папку на Google Drive',
      description: 'Откройте Google Drive и создайте новую папку для контента',
      icon: FolderOpen,
    },
    {
      title: 'Создайте подпапки videos и photos',
      description: 'Внутри созданной папки создайте две подпапки для видео и изображений',
      icon: FolderOpen,
    },
    {
      title: 'Загрузите медиафайлы',
      description: 'Разложите файлы по папкам: видео в videos/, фото в photos/',
      icon: Video,
    },
    {
      title: 'Скопируйте ссылку на папку',
      description: 'Нажмите правой кнопкой на папку → "Получить ссылку" → скопируйте URL',
      icon: Link2,
    },
    {
      title: 'Авторизуйтесь и подключите',
      description: 'Вставьте ссылку в Crosspost, пройдите авторизацию Google и готово!',
      icon: Shield,
    },
  ],
}

const supportedFormats = {
  video: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
}

const faq = [
  {
    q: 'Как часто происходит синхронизация?',
    a: 'Автоматическая синхронизация происходит каждый час. Вы также можете запустить синхронизацию вручную в любой момент.',
  },
  {
    q: 'Изменяются ли оригинальные файлы?',
    a: 'Нет, оригинальные файлы в облаке никогда не изменяются. Мы создаём адаптированные копии для каждой платформы.',
  },
  {
    q: 'Можно ли использовать публичную ссылку Яндекс.Диска?',
    a: 'Да! Для Яндекс.Диска можно использовать публичную ссылку — авторизация не требуется.',
  },
  {
    q: 'Какие ограничения по размеру файлов?',
    a: 'Видео до 2 ГБ, изображения до 50 МБ. Для больших файлов рекомендуем использовать сжатие.',
  },
  {
    q: 'Что происходит с новыми файлами?',
    a: 'Новые файлы автоматически обнаруживаются при следующей синхронизации и добавляются в вашу медиатеку.',
  },
]

export default function CloudStorageGuidePage() {
  const [activeProvider, setActiveProvider] = useState<'yandex' | 'google'>('yandex')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPath(id)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <span className="font-bold">Crosspost</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
            >
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Cloud className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">Инструкция</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Подключение облачного хранилища
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Подключите Google Drive или Яндекс.Диск и ваш контент будет автоматически
            синхронизироваться и адаптироваться под все соцсети
          </p>
        </div>
      </section>

      {/* Folder Structure */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              Структура папок
            </h2>

            <div className="bg-gray-900/50 rounded-xl p-4 font-mono text-sm mb-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <FolderOpen className="w-4 h-4" />
                <span>my-content/</span>
                <button
                  onClick={() => copyToClipboard('my-content/', 'root')}
                  className="ml-2 p-1 rounded hover:bg-white/10 transition"
                >
                  {copiedPath === 'root' ? (
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="ml-6 mt-2 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <FolderOpen className="w-4 h-4" />
                  <span>videos/</span>
                  <span className="text-gray-500 text-xs ml-2">.mp4, .mov, .avi, .mkv, .webm</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <FolderOpen className="w-4 h-4" />
                  <span>photos/</span>
                  <span className="text-gray-500 text-xs ml-2">.jpg, .png, .webp, .gif</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">Видео форматы</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supportedFormats.video.map(format => (
                    <span key={format} className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-xs">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Форматы изображений</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supportedFormats.image.map(format => (
                    <span key={format} className="px-2 py-1 rounded bg-green-500/10 text-green-300 text-xs">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Selection */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Выберите провайдера</h2>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveProvider('yandex')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition ${
                activeProvider === 'yandex'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <HardDrive className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <div className="font-semibold">Яндекс.Диск</div>
                <div className="text-xs text-gray-400">Публичные ссылки без авторизации</div>
              </div>
              {activeProvider === 'yandex' && (
                <Check className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            <button
              onClick={() => setActiveProvider('google')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition ${
                activeProvider === 'google'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <HardDrive className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold">Google Drive</div>
                <div className="text-xs text-gray-400">Требуется авторизация Google</div>
              </div>
              {activeProvider === 'google' && (
                <Check className="w-5 h-5 text-blue-400" />
              )}
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps[activeProvider].map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeProvider === 'yandex' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <span className={`font-bold ${
                    activeProvider === 'yandex' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                <step.icon className={`w-5 h-5 ${
                  activeProvider === 'yandex' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
              </div>
            ))}
          </div>

          {/* Provider-specific tips */}
          {activeProvider === 'yandex' && (
            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-300 mb-1">Преимущество Яндекс.Диска</h4>
                  <p className="text-sm text-gray-400">
                    Публичные ссылки работают без авторизации! Просто поделитесь папкой и вставьте ссылку.
                    Не нужно давать доступ к аккаунту.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeProvider === 'google' && (
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-300 mb-1">Безопасность Google Drive</h4>
                  <p className="text-sm text-gray-400">
                    Мы запрашиваем только доступ к указанной папке через OAuth 2.0.
                    Токен можно отозвать в любой момент в настройках Google аккаунта.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What happens next */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Что происходит после подключения</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-2">Автосинхронизация</h3>
              <p className="text-sm text-gray-400">
                Файлы автоматически синхронизируются каждый час или вручную по запросу
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Умная адаптация</h3>
              <p className="text-sm text-gray-400">
                AI автоматически кропает медиа под каждую платформу без чёрных полос
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Готово к публикации</h3>
              <p className="text-sm text-gray-400">
                Файлы появляются в медиатеке и готовы для создания постов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                  {item.q}
                </h3>
                <p className="text-sm text-gray-400 ml-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы подключить?</h2>
          <p className="text-gray-400 mb-8">
            Перейдите в личный кабинет и подключите своё облачное хранилище
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:opacity-90 transition"
          >
            Перейти в кабинет
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>Crosspost by Sales Whisper</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/" className="hover:text-white transition">Главная</Link>
            <Link href="/pricing" className="hover:text-white transition">Тарифы</Link>
            <Link href="/login" className="hover:text-white transition">Войти</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
