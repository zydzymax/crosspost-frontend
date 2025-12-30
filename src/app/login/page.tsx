'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft, Loader2, Mail } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push(redirectUrl)
    }
  }, [router, redirectUrl])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const cleanEmail = email.trim().toLowerCase()
      if (!cleanEmail) {
        setError('Введите ваш email')
        setLoading(false)
        return
      }

      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setError('Введите корректный email')
        setLoading(false)
        return
      }

      const response = await fetch('/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
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
      const cleanEmail = email.trim().toLowerCase()
      const cleanCode = code.trim()

      if (!cleanCode) {
        setError('Введите код из письма')
        setLoading(false)
        return
      }

      const response = await fetch('/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode }),
      })

      const data = await response.json()

      if (data.success && data.access_token) {
        // Save token in localStorage and cookie for cross-domain
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Set cross-domain cookie
        document.cookie = `sw_token=${data.access_token}; domain=.saleswhisper.pro; path=/; secure; samesite=lax; max-age=${data.expires_in || 604800}`

        router.push(redirectUrl)
      } else {
        setError(data.detail || 'Неверный код')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setError(null)
    setMessage(null)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Вход в Crosspost</h1>
        <p className="text-gray-400">Введите email для получения кода</p>
      </div>

      <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
            <p className="text-gray-400">
              {step === 'email' ? 'Отправка кода...' : 'Проверка кода...'}
            </p>
          </div>
        ) : step === 'email' ? (
          <form onSubmit={handleSendCode}>
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Получить код
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Мы отправим 6-значный код на ваш email
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
                Код из письма
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
              onClick={handleBackToEmail}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 transition"
            >
              Изменить email
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
  )
}

function LoginFormLoading() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Вход в Crosspost</h1>
        <p className="text-gray-400">Загрузка...</p>
      </div>
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    </div>
  )
}

export default function LoginPage() {
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
        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
