'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Youtube, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function YouTubeConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [channelName, setChannelName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!clientId || !clientSecret || !refreshToken) {
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
          platform: 'youtube',
          credentials: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
          },
          display_name: channelName || 'YouTube канал',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=youtube')
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
        <div className="w-16 h-16 rounded-2xl bg-[#FF0000]/20 flex items-center justify-center">
          <Youtube className="w-8 h-8 text-[#FF0000]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение YouTube</h1>
          <p className="text-gray-400">Загрузка видео и Shorts</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? 'bg-red-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 1 ? 'bg-white/5 border-red-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-500 text-sm flex items-center justify-center">1</span>
              Создайте проект в Google Cloud
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите в <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google Cloud Console</a></li>
                <li>Создайте новый проект или выберите существующий</li>
                <li>Перейдите в <span className="text-red-400">APIs & Services → Library</span></li>
                <li>Найдите и включите <span className="text-red-400">YouTube Data API v3</span></li>
              </ol>

              <a
                href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF0000] rounded-lg hover:bg-[#FF0000]/80 transition"
              >
                Открыть Google Cloud Console
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-red-500 rounded-xl font-medium hover:bg-red-600 transition mt-4"
              >
                API включен
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 2 ? 'bg-white/5 border-red-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 2 ? 'bg-red-500' : 'bg-white/10'
              }`}>2</span>
              Настройте OAuth Consent Screen
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите: <span className="text-red-400">APIs & Services → OAuth consent screen</span></li>
                <li>Выберите тип <span className="text-red-400">External</span></li>
                <li>Заполните обязательные поля:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>App name</li>
                    <li>User support email</li>
                    <li>Developer contact email</li>
                  </ul>
                </li>
                <li>Добавьте scope: <code className="bg-white/10 px-2 py-0.5 rounded text-sm">https://www.googleapis.com/auth/youtube.upload</code></li>
                <li>Добавьте себя в Test users</li>
              </ol>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-medium hover:bg-red-600 transition"
                >
                  Consent Screen настроен
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 3 ? 'bg-white/5 border-red-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 3 ? 'bg-red-500' : 'bg-white/10'
              }`}>3</span>
              Создайте OAuth 2.0 Credentials
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите: <span className="text-red-400">APIs & Services → Credentials</span></li>
                <li>Нажмите <span className="text-red-400">Create Credentials → OAuth client ID</span></li>
                <li>Выберите тип: <span className="text-red-400">Web application</span></li>
                <li>Добавьте Authorized redirect URI: <code className="bg-white/10 px-2 py-0.5 rounded text-sm block mt-1 mb-1">https://developers.google.com/oauthplayground</code></li>
                <li>Скопируйте Client ID и Client Secret</li>
              </ol>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Client ID:</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="xxxx.apps.googleusercontent.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Client Secret:</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => (clientId && clientSecret) && setStep(4)}
                  disabled={!clientId || !clientSecret}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 4 ? 'bg-white/5 border-red-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 4 ? 'bg-red-500' : 'bg-white/10'
              }`}>4</span>
              Получите Refresh Token
            </h3>
            {step > 4 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">OAuth 2.0 Playground</a></li>
                <li>Нажмите на шестеренку (⚙️) справа вверху</li>
                <li>Включите <span className="text-red-400">Use your own OAuth credentials</span></li>
                <li>Вставьте ваш Client ID и Client Secret</li>
                <li>Слева выберите <span className="text-red-400">YouTube Data API v3 → youtube.upload</span></li>
                <li>Нажмите <span className="text-red-400">Authorize APIs</span></li>
                <li>Авторизуйтесь в вашем Google/YouTube аккаунте</li>
                <li>Нажмите <span className="text-red-400">Exchange authorization code for tokens</span></li>
                <li>Скопируйте <span className="text-red-400">Refresh token</span></li>
              </ol>

              <a
                href="https://developers.google.com/oauthplayground"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
              >
                Открыть OAuth 2.0 Playground
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    <strong>Важно:</strong> Refresh token не истекает (пока приложение в Testing mode).
                    Храните его в безопасности!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-medium hover:bg-red-600 transition"
                >
                  Токен получен
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 5 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 5 ? 'bg-white/5 border-red-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 5 ? 'bg-red-500' : 'bg-white/10'
              }`}>5</span>
              Завершите подключение
            </h3>
          </div>

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Refresh Token:</label>
                <input
                  type="text"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="1//xxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название канала:</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Мой YouTube канал"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!refreshToken || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить YouTube'
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
