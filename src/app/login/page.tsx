'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft, Loader2, MessageCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'username' | 'code'>('username')
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const cleanUsername = username.replace('@', '').trim()
      if (!cleanUsername) {
        setError('Введите ваш Telegram username')
        setLoading(false)
        return
      }

      const response = await fetch('/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setStep('code')
      } else {
        setError(data.detail || 'Ошибка отправки кода')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const cleanUsername = username.replace('@', '').trim()
      const cleanCode = code.trim()

      if (!cleanCode) {
        setError('Введите код из Telegram')
        setLoading(false)
        return
      }

      const response = await fetch('/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, code: cleanCode }),
      })

      const data = await response.json()

      if (data.success && data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.detail || 'Неверный код')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToUsername = () => {
    setStep('username')
    setCode('')
    setError(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Вход в Crosspost</h1>
            <p className="text-gray-400">Войдите через Telegram для начала работы</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
                <p className="text-gray-400">
                  {step === 'username' ? 'Отправка кода...' : 'Проверка кода...'}
                </p>
              </div>
            ) : step === 'username' ? (
              <form onSubmit={handleSendCode}>
                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Telegram username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your_username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Получить код в Telegram
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Сначала отправьте /start боту{' '}
                  <a
                    href="https://t.me/login_SalesWhisper_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    @login_SalesWhisper_bot
                  </a>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    {message}
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                    Код из Telegram
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={6}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition"
                >
                  Войти
                </button>

                <button
                  type="button"
                  onClick={handleBackToUsername}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 transition"
                >
                  Изменить username
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            Входя в систему, вы соглашаетесь с{' '}
            <a href="https://saleswhisper.pro/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">условиями использования</a>
            {' '}и{' '}
            <a href="https://saleswhisper.pro/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">политикой конфиденциальности</a>
          </p>
        </div>
      </main>
    </div>
  )
}
