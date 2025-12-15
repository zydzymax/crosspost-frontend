'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, MessageSquare, Copy, Check, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function TelegramConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [channelName, setChannelName] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleConnect = async () => {
    if (!botToken || !chatId) {
      setError('Заполните все поля')
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
          platform: 'telegram',
          credentials: {
            bot_token: botToken,
            chat_id: chatId,
          },
          display_name: channelName || 'Telegram канал',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=telegram')
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
        <div className="w-16 h-16 rounded-2xl bg-[#0088cc]/20 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-[#0088cc]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение Telegram</h1>
          <p className="text-gray-400">Публикация в каналы и группы</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? 'bg-indigo-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 1 ? 'bg-white/5 border-indigo-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">1</span>
              Создайте бота через @BotFather
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте Telegram и найдите <span className="text-indigo-400">@BotFather</span></li>
                <li>Отправьте команду <code className="px-2 py-0.5 bg-white/10 rounded">/newbot</code></li>
                <li>Введите название бота (например: "Мой Crosspost Bot")</li>
                <li>Введите username бота (должен заканчиваться на "bot")</li>
              </ol>

              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc] rounded-lg hover:bg-[#0088cc]/80 transition"
              >
                Открыть @BotFather
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition mt-4"
              >
                Бот создан, продолжить
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 2 ? 'bg-white/5 border-indigo-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 2 ? 'bg-indigo-500' : 'bg-white/10'
              }`}>2</span>
              Скопируйте токен бота
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                После создания бота, BotFather отправит вам токен в формате:
              </p>

              <div className="p-3 bg-white/5 rounded-lg font-mono text-sm flex items-center justify-between">
                <span className="text-gray-400">123456789:ABCdefGHIjklMNOpqrSTUvwxYZ</span>
                <button
                  onClick={() => copyToClipboard('123456789:ABCdefGHIjklMNOpqrSTUvwxYZ', 'example')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {copied === 'example' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Вставьте токен бота:</label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => botToken && setStep(3)}
                  disabled={!botToken}
                  className="flex-1 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 3 ? 'bg-white/5 border-indigo-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 3 ? 'bg-indigo-500' : 'bg-white/10'
              }`}>3</span>
              Добавьте бота в канал
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте ваш Telegram канал или группу</li>
                <li>Нажмите на название канала → Управление каналом</li>
                <li>Выберите "Администраторы" → "Добавить администратора"</li>
                <li>Найдите вашего бота по username и добавьте</li>
                <li>Дайте права на публикацию сообщений</li>
              </ol>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Бот должен быть администратором с правом отправки сообщений,
                    иначе публикация не будет работать.
                  </p>
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
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition"
                >
                  Бот добавлен, продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 4 ? 'bg-white/5 border-indigo-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 4 ? 'bg-indigo-500' : 'bg-white/10'
              }`}>4</span>
              Получите Chat ID
            </h3>
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Для отправки сообщений нужен ID канала или группы:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте <a href="https://t.me/getidsbot" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">@getidsbot</a> в Telegram</li>
                <li>Перешлите любое сообщение из вашего канала боту</li>
                <li>Бот покажет <span className="text-indigo-400">Forwarded from chat ID</span></li>
                <li>Для публичного канала можно использовать @username</li>
              </ol>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Введите Chat ID или @username:</label>
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  placeholder="-1001234567890 или @mychannel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название для отображения (опционально):</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Мой канал"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!chatId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить Telegram'
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
