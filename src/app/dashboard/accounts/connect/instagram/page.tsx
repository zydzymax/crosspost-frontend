'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Instagram, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function InstagramConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [accountName, setAccountName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!accessToken || !businessId) {
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
          platform: 'instagram',
          credentials: {
            access_token: accessToken,
            instagram_business_id: businessId,
          },
          display_name: accountName || 'Instagram',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=instagram')
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center">
          <Instagram className="w-8 h-8 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение Instagram</h1>
          <p className="text-gray-400">Публикация постов, Stories и Reels</p>
        </div>
      </div>

      {/* Important notice */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Важно:</strong> Instagram API работает только через Meta Business Suite.
              Вам нужен бизнес или креаторский аккаунт Instagram, связанный с Facebook Page.
            </p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
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
              Переключитесь на бизнес-аккаунт
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Откройте приложение Instagram</li>
                <li>Перейдите: <span className="text-indigo-400">Настройки → Аккаунт → Тип аккаунта</span></li>
                <li>Выберите <span className="text-indigo-400">Бизнес-аккаунт</span> или <span className="text-indigo-400">Креаторский</span></li>
                <li>Выберите категорию бизнеса</li>
              </ol>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition mt-4"
              >
                У меня бизнес-аккаунт
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
              Свяжите Instagram с Facebook Page
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Создайте Facebook Page (страницу), если её нет</li>
                <li>В Instagram: <span className="text-indigo-400">Настройки → Связанные аккаунты</span></li>
                <li>Выберите <span className="text-indigo-400">Facebook</span></li>
                <li>Подключите вашу Facebook Page</li>
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
                  className="flex-1 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition"
                >
                  Аккаунты связаны
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
              Создайте приложение Meta
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите на <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">developers.facebook.com</a></li>
                <li>Нажмите <span className="text-indigo-400">My Apps → Create App</span></li>
                <li>Выберите тип: <span className="text-indigo-400">Business</span></li>
                <li>Введите название приложения</li>
                <li>В настройках добавьте продукт <span className="text-indigo-400">Instagram Graph API</span></li>
              </ol>

              <a
                href="https://developers.facebook.com/apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] rounded-lg hover:bg-[#1877F2]/80 transition"
              >
                Открыть Meta for Developers
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex gap-3 mt-4">
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
                  Приложение создано
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
              Получите Access Token
            </h3>
            {step > 4 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>В приложении Meta перейдите в <span className="text-indigo-400">Tools → Graph API Explorer</span></li>
                <li>Выберите ваше приложение</li>
                <li>Нажмите <span className="text-indigo-400">Generate Access Token</span></li>
                <li>Выберите права:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>instagram_basic</li>
                    <li>instagram_content_publish</li>
                    <li>pages_read_engagement</li>
                    <li>pages_show_list</li>
                  </ul>
                </li>
                <li>Преобразуйте в долгосрочный токен (60 дней)</li>
              </ol>

              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Открыть Graph API Explorer
                <ExternalLink className="w-4 h-4" />
              </a>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Вставьте Access Token:</label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="EAAG..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => accessToken && setStep(5)}
                  disabled={!accessToken}
                  className="flex-1 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 5 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 5 ? 'bg-white/5 border-indigo-500/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 5 ? 'bg-indigo-500' : 'bg-white/10'
              }`}>5</span>
              Введите Instagram Business ID
            </h3>
          </div>

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Получите Instagram Business Account ID через Graph API:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>В Graph API Explorer выполните запрос: <code className="bg-white/10 px-2 py-0.5 rounded text-sm">/me/accounts</code></li>
                <li>Найдите вашу Facebook Page и её ID</li>
                <li>Выполните: <code className="bg-white/10 px-2 py-0.5 rounded text-sm">/PAGE_ID?fields=instagram_business_account</code></li>
                <li>Скопируйте значение <span className="text-indigo-400">instagram_business_account.id</span></li>
              </ol>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Instagram Business Account ID:</label>
                <input
                  type="text"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="17841400000000000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название аккаунта:</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="@myinstagram"
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
                  onClick={() => setStep(4)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!businessId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить Instagram'
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
