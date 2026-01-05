'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Video, Copy, Check, ExternalLink,
  AlertCircle, Loader2, CheckCircle2, MessageSquare
} from 'lucide-react'

export default function DzenConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [telegramChannelId, setTelegramChannelId] = useState('')
  const [dzenChannelUrl, setDzenChannelUrl] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!telegramChannelId) {
      setError('Укажите ID Telegram канала')
      return
    }

    setConnecting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/accounts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'dzen',
          credentials: {
            telegram_channel_id: telegramChannelId,
            dzen_channel_url: dzenChannelUrl,
            sync_via_telegram: true,
          },
          display_name: displayName || 'Дзен канал',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=dzen')
      } else {
        const data = await res.json()
        setError(data.detail || 'Не удалось подключить аккаунт')
      }
    } catch (err) {
      setError('Ошибка подключения')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к аккаунтам
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#FFCC00]/20 flex items-center justify-center">
          <Video className="w-8 h-8 text-[#FFCC00]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение Дзен</h1>
          <p className="text-gray-400">Публикация через синхронизацию с Telegram</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-8">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-indigo-400 mb-1">Как это работает?</p>
            <p>
              Дзен поддерживает автоматическую синхронизацию с Telegram. 
              Мы публикуем контент в ваш Telegram канал, а официальный бот Дзена 
              автоматически переносит его на вашу страницу в Дзене.
            </p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? 'bg-[#FFCC00]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 1 ? 'bg-white/5 border-[#FFCC00]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFCC00] text-black text-sm flex items-center justify-center">1</span>
              Подключите Telegram к Дзен
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>У вас должен быть <span className="text-[#FFCC00]">публичный Telegram канал</span></li>
                <li>Откройте в Telegram бота <span className="text-indigo-400">@zen_sync_bot</span></li>
                <li>Отправьте боту ссылку на ваш Telegram канал</li>
                <li>Авторизуйтесь в Дзен через бота</li>
                <li>Выберите режим синхронизации (рекомендуем "Автоматически")</li>
              </ol>

              <div className="flex gap-3">
                <a
                  href="https://t.me/zen_sync_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc] rounded-lg hover:bg-[#0088cc]/80 transition"
                >
                  Открыть @zen_sync_bot
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-yellow-400 mb-1">Важно!</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Канал должен быть публичным (с @username)</li>
                      <li>Файлы до 20 МБ переносятся автоматически</li>
                      <li>Поддерживаются: текст, фото, видео</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-[#FFCC00] text-black rounded-xl font-medium hover:bg-[#FFCC00]/90 transition mt-4"
              >
                Синхронизация настроена, продолжить
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 2 ? 'bg-white/5 border-[#FFCC00]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 2 ? 'bg-[#FFCC00] text-black' : 'bg-white/10'
              }`}>2</span>
              Подключите Telegram канал к SalesWhisper
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Теперь добавьте этот же Telegram канал в SalesWhisper для публикации:
              </p>

              <Link
                href="/dashboard/accounts/connect/telegram"
                className="flex items-center gap-3 p-4 bg-[#0088cc]/10 border border-[#0088cc]/30 rounded-xl hover:bg-[#0088cc]/20 transition"
              >
                <MessageSquare className="w-8 h-8 text-[#0088cc]" />
                <div>
                  <p className="font-medium">Подключить Telegram канал</p>
                  <p className="text-sm text-gray-400">Перейти к настройке Telegram</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>

              <p className="text-sm text-gray-400">
                После подключения Telegram канала вернитесь сюда для завершения настройки Дзен.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#FFCC00] text-black rounded-xl font-medium hover:bg-[#FFCC00]/90 transition"
                >
                  Telegram подключен, продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 3 ? 'bg-white/5 border-[#FFCC00]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 3 ? 'bg-[#FFCC00] text-black' : 'bg-white/10'
              }`}>3</span>
              Укажите данные для Дзен
            </h3>
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ID или @username Telegram канала (связанного с Дзен):
                </label>
                <input
                  type="text"
                  value={telegramChannelId}
                  onChange={(e) => setTelegramChannelId(e.target.value)}
                  placeholder="@mychannel или -1001234567890"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FFCC00] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ссылка на канал в Дзен (опционально):
                </label>
                <input
                  type="text"
                  value={dzenChannelUrl}
                  onChange={(e) => setDzenChannelUrl(e.target.value)}
                  placeholder="https://dzen.ru/mychannel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FFCC00] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Название для отображения:
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Мой Дзен канал"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FFCC00] focus:outline-none transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-green-400 mb-1">Готово к публикации!</p>
                    <p>
                      При публикации в Дзен, контент будет отправлен в указанный 
                      Telegram канал, а @zen_sync_bot автоматически перенесёт его в Дзен.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!telegramChannelId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#FFCC00] to-orange-500 text-black rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить Дзен'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
