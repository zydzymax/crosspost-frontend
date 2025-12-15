'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Video, ExternalLink,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react'

export default function RuTubeConnectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [apiKey, setApiKey] = useState('')
  const [channelName, setChannelName] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!apiKey) {
      setError('Введите API ключ')
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
          platform: 'rutube',
          credentials: {
            api_key: apiKey,
          },
          display_name: channelName || 'RuTube канал',
        }),
      })

      if (res.ok) {
        router.push('/dashboard/accounts?connected=rutube')
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
        <div className="w-16 h-16 rounded-2xl bg-[#00A8E6]/20 flex items-center justify-center">
          <Video className="w-8 h-8 text-[#00A8E6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Подключение RuTube</h1>
          <p className="text-gray-400">Российская видеоплатформа</p>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
        <p className="text-sm text-gray-300">
          RuTube имеет простой процесс подключения - нужен только API ключ,
          который можно сгенерировать в личном кабинете.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition ${
              s <= step ? 'bg-[#00A8E6]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 1 ? 'bg-white/5 border-[#00A8E6]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00A8E6] text-sm flex items-center justify-center text-white">1</span>
              Войдите в RuTube Studio
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Перейдите на <a href="https://rutube.ru" target="_blank" rel="noopener noreferrer" className="text-[#00A8E6] hover:underline">rutube.ru</a></li>
                <li>Войдите в свой аккаунт или зарегистрируйтесь</li>
                <li>Перейдите в <span className="text-[#00A8E6]">Студия</span> (иконка в верхнем меню)</li>
              </ol>

              <a
                href="https://studio.rutube.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A8E6] rounded-lg hover:bg-[#00A8E6]/80 transition"
              >
                Открыть RuTube Studio
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setStep(2)}
                className="block w-full py-3 bg-[#00A8E6] rounded-xl font-medium hover:bg-[#00A8E6]/80 transition mt-4"
              >
                Я в Студии
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 2 ? 'bg-white/5 border-[#00A8E6]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 2 ? 'bg-[#00A8E6] text-white' : 'bg-white/10'
              }`}>2</span>
              Сгенерируйте API ключ
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>В Студии перейдите: <span className="text-[#00A8E6]">Настройки → API</span></li>
                <li>Нажмите <span className="text-[#00A8E6]">Создать API ключ</span></li>
                <li>Введите название ключа (например: "Crosspost")</li>
                <li>Нажмите <span className="text-[#00A8E6]">Сгенерировать</span></li>
                <li>Скопируйте ключ сразу - он показывается только один раз!</li>
              </ol>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    <strong>Важно:</strong> API ключ показывается только один раз при создании.
                    Если потеряете - придётся генерировать новый.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#00A8E6] rounded-xl font-medium hover:bg-[#00A8E6]/80 transition"
                >
                  Ключ скопирован
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className={`p-6 rounded-xl border transition ${
          step === 3 ? 'bg-white/5 border-[#00A8E6]/50' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${
                step >= 3 ? 'bg-[#00A8E6] text-white' : 'bg-white/10'
              }`}>3</span>
              Завершите подключение
            </h3>
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">API ключ RuTube:</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#00A8E6] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Название канала (опционально):</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Мой канал на RuTube"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#00A8E6] focus:outline-none transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Назад
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!apiKey || connecting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#00A8E6] to-indigo-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    'Подключить RuTube'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
        <h4 className="font-semibold mb-3">Возможности RuTube API</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
          <li>Загрузка видео до 10 ГБ</li>
          <li>Максимальная длительность: 12 часов</li>
          <li>Поддержка форматов: MP4, MOV, AVI, WMV, MKV, FLV</li>
          <li>Настройка категорий и возрастных ограничений</li>
          <li>Отложенная публикация</li>
        </ul>
      </div>
    </div>
  )
}
