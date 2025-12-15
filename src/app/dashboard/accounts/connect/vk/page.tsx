'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Users, Copy, Check, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function VKConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupName, setGroupName] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleConnect = async () => {
    if (!accessToken || !groupId) {
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
          platform: 'vk',
          credentials: {
            access_token: accessToken,
            group_id: groupId,
          },
          display_name: groupName || 'VK группа',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=vk')
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
        <div className="w-16 h-16 rounded-2xl bg-[#4a76a8]/20 flex items-center justify-center">
          <Users className="w-8 h-8 text-[#4a76a8]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение VKontakte</h1>
          <p className="text-gray-400">Публикация в сообщества</p>
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
              Создайте приложение VK
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите на <a href="https://vk.com/apps?act=manage" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">vk.com/apps?act=manage</a></li>
                <li>Нажмите "Создать приложение"</li>
                <li>Выберите тип: <span className="text-indigo-400">Standalone-приложение</span></li>
                <li>Введите название (например: "Crosspost App")</li>
                <li>Нажмите "Подключить приложение"</li>
              </ol>

              <a
                href="https://vk.com/apps?act=manage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4a76a8] rounded-lg hover:bg-[#4a76a8]/80 transition"
              >
                Открыть VK для разработчиков
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition mt-4"
              >
                Приложение создано, продолжить
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
              Получите Access Token
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Для получения токена с правами на публикацию:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>В настройках приложения найдите ID приложения</li>
                <li>Перейдите по ссылке авторизации (замените YOUR_APP_ID):</li>
              </ol>

              <div className="p-3 bg-white/5 rounded-lg font-mono text-xs overflow-x-auto">
                <code>https://oauth.vk.com/authorize?client_id=YOUR_APP_ID&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=wall,photos,video,groups,offline&response_type=token</code>
              </div>

              <ol start={3} className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Разрешите доступ приложению</li>
                <li>Скопируйте <span className="text-indigo-400">access_token</span> из URL</li>
              </ol>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Токен содержит <code className="bg-white/10 px-1 rounded">offline</code> права и не истекает.
                    Храните его в безопасности!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Вставьте Access Token:</label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="vk1.a.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
                  onClick={() => accessToken && setStep(3)}
                  disabled={!accessToken}
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
              Настройте права в сообществе
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте ваше сообщество VK</li>
                <li>Перейдите: <span className="text-indigo-400">Управление → Работа с API</span></li>
                <li>Нажмите "Создать ключ"</li>
                <li>Выберите права: <span className="text-indigo-400">Записи на стене, Фотографии, Видео</span></li>
                <li>Подтвердите создание ключа</li>
              </ol>

              <p className="text-sm text-gray-400">
                Либо вы можете использовать Access Token от своего аккаунта,
                если вы администратор сообщества.
              </p>

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
                  Продолжить
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
              Введите ID сообщества
            </h3>
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                ID сообщества можно найти в URL или в настройках:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>В URL: vk.com/club<span className="text-indigo-400">123456789</span></li>
                <li>Или: Управление → Адрес страницы</li>
                <li>ID указывается <strong>без минуса</strong> для сообществ</li>
              </ul>

              <div>
                <label className="block text-sm text-gray-400 mb-2">ID сообщества:</label>
                <input
                  type="text"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="123456789"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название для отображения:</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Моё сообщество VK"
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
                  disabled={!groupId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить VKontakte'
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
