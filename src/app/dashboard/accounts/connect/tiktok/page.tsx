'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Music2, ExternalLink,
  AlertCircle, Loader2, CheckCircle2, Info
} from 'lucide-react'

export default function TikTokConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [clientKey, setClientKey] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [openId, setOpenId] = useState('')
  const [accountName, setAccountName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!accessToken || !openId) {
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
          platform: 'tiktok',
          credentials: {
            client_key: clientKey,
            client_secret: clientSecret,
            access_token: accessToken,
            open_id: openId,
          },
          display_name: accountName || 'TikTok',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=tiktok')
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
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center border border-white/20">
          <Music2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение TikTok</h1>
          <p className="text-gray-400">Публикация видеоконтента</p>
        </div>
      </div>

      {/* Important notice */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Важно:</strong> TikTok Content Posting API требует:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400">
              <li>Бизнес-аккаунт TikTok</li>
              <li>Одобренное приложение разработчика</li>
              <li>Процесс одобрения может занять несколько дней</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? 'bg-cyan-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 1 ? 'bg-white/5 border-cyan-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-sm flex items-center justify-center text-black">1</span>
              Создайте приложение TikTok
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите на <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">developers.tiktok.com</a></li>
                <li>Войдите с бизнес-аккаунтом TikTok</li>
                <li>Нажмите <span className="text-cyan-400">Manage apps → Create app</span></li>
                <li>Заполните информацию о приложении</li>
                <li>Выберите продукты:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Login Kit</li>
                    <li>Content Posting API</li>
                  </ul>
                </li>
              </ol>

              <a
                href="https://developers.tiktok.com/apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                TikTok for Developers
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-cyan-500 text-black rounded-xl font-medium hover:bg-cyan-400 transition mt-4"
              >
                Приложение создано
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 2 ? 'bg-white/5 border-cyan-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 2 ? 'bg-cyan-500 text-black' : 'bg-white/10'
              }`}>2</span>
              Получите Client Key и Secret
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте созданное приложение</li>
                <li>Перейдите в раздел <span className="text-cyan-400">App details</span></li>
                <li>Скопируйте <span className="text-cyan-400">Client Key</span></li>
                <li>Скопируйте <span className="text-cyan-400">Client Secret</span></li>
              </ol>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Для Content Posting API приложение должно пройти модерацию TikTok.
                    Это может занять 1-5 рабочих дней.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Client Key:</label>
                <input
                  type="text"
                  value={clientKey}
                  onChange={(e) => setClientKey(e.target.value)}
                  placeholder="awxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Client Secret:</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
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
                  onClick={() => (clientKey && clientSecret) && setStep(3)}
                  disabled={!clientKey || !clientSecret}
                  className="flex-1 py-3 bg-cyan-500 text-black rounded-xl font-medium hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 3 ? 'bg-white/5 border-cyan-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 3 ? 'bg-cyan-500 text-black' : 'bg-white/10'
              }`}>3</span>
              OAuth авторизация
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Выполните OAuth авторизацию для получения Access Token:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Настройте Redirect URI в приложении TikTok</li>
                <li>Перейдите по OAuth URL с вашим Client Key</li>
                <li>Авторизуйтесь в TikTok</li>
                <li>Получите authorization code</li>
                <li>Обменяйте code на access_token через API</li>
              </ol>

              <div className="p-3 bg-white/5 rounded-lg font-mono text-xs overflow-x-auto">
                <code>https://www.tiktok.com/v2/auth/authorize/?client_key=YOUR_KEY&scope=user.info.basic,video.publish&response_type=code&redirect_uri=YOUR_REDIRECT</code>
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
                  className="flex-1 py-3 bg-cyan-500 text-black rounded-xl font-medium hover:bg-cyan-400 transition"
                >
                  Токен получен
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 4 ? 'bg-white/5 border-cyan-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 4 ? 'bg-cyan-500 text-black' : 'bg-white/10'
              }`}>4</span>
              Завершите подключение
            </h3>
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Access Token:</label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="act.xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Open ID:</label>
                <input
                  type="text"
                  value={openId}
                  onChange={(e) => setOpenId(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Open ID возвращается вместе с access_token при авторизации
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название аккаунта:</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="@mytiktok"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
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
                  disabled={!accessToken || !openId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 rounded-xl font-medium text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить TikTok'
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
