'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Facebook, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function FacebookConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [pageId, setPageId] = useState('')
  const [pageName, setPageName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!accessToken || !pageId) {
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
          platform: 'facebook',
          credentials: {
            access_token: accessToken,
            page_id: pageId,
          },
          display_name: pageName || 'Facebook Page',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=facebook')
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
        <div className="w-16 h-16 rounded-2xl bg-[#1877F2]/20 flex items-center justify-center">
          <Facebook className="w-8 h-8 text-[#1877F2]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение Facebook</h1>
          <p className="text-gray-400">Публикация на страницы Facebook</p>
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
              Создайте приложение Meta
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите на <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">developers.facebook.com</a></li>
                <li>Нажмите <span className="text-indigo-400">My Apps → Create App</span></li>
                <li>Выберите тип: <span className="text-indigo-400">Business</span></li>
                <li>Введите название приложения</li>
                <li>В настройках добавьте продукты:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Facebook Login</li>
                    <li>Pages API</li>
                  </ul>
                </li>
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

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-600 transition mt-4"
              >
                Приложение создано
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
              Получите Page Access Token
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите в <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Graph API Explorer</a></li>
                <li>Выберите ваше приложение</li>
                <li>Нажмите <span className="text-indigo-400">Get Token → Get Page Access Token</span></li>
                <li>Выберите нужные разрешения:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>pages_manage_posts</li>
                    <li>pages_read_engagement</li>
                    <li>pages_show_list</li>
                  </ul>
                </li>
                <li>Авторизуйтесь и выберите Facebook Page</li>
              </ol>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-sm text-gray-300">
                  <strong>Совет:</strong> Преобразуйте токен в долгосрочный через Access Token Debugger,
                  чтобы он не истекал через час.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Page Access Token:</label>
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
              Получите Page ID
            </h3>
            {step > 3 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Page ID можно найти несколькими способами:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>В Graph API Explorer выполните: <code className="bg-white/10 px-2 py-0.5 rounded text-sm">/me/accounts</code></li>
                <li>Найдите вашу страницу в результатах</li>
                <li>Скопируйте значение <span className="text-indigo-400">id</span></li>
              </ol>

              <p className="text-sm text-gray-400">
                Или: откройте страницу в браузере → О странице → ID страницы (внизу)
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
                  Page ID найден
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
              Завершите подключение
            </h3>
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Page ID:</label>
                <input
                  type="text"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  placeholder="123456789012345"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название страницы:</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="Моя страница"
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
                  disabled={!pageId || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1877F2] to-indigo-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить Facebook'
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
