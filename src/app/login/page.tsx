'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void
  }
}

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Telegram Login callback
    window.onTelegramAuth = async (user: TelegramUser) => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/v1/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })
        
        const data = await response.json()
        
        if (data.success && data.access_token) {
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          router.push('/dashboard')
        } else {
          setError(data.detail || 'Ошибка авторизации')
        }
      } catch (err) {
        setError('Ошибка подключения к серверу')
      } finally {
        setLoading(false)
      }
    }

    // Load Telegram Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'CrosspostSovaniBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '12')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    
    const container = document.getElementById('telegram-login')
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }, [router])

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

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
                <p className="text-gray-400">Выполняется вход...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div id="telegram-login" className="flex justify-center py-4">
                  {/* Telegram widget will be inserted here */}
                </div>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  Нажмите кнопку выше для входа через Telegram
                </p>
              </>
            )}
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            Входя в систему, вы соглашаетесь с{' '}
            <a href="#" className="text-indigo-400 hover:underline">условиями использования</a>
            {' '}и{' '}
            <a href="#" className="text-indigo-400 hover:underline">политикой конфиденциальности</a>
          </p>
        </div>
      </main>
    </div>
  )
}
