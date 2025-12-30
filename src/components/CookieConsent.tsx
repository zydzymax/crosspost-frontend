'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const METRIKA_ID = 105925596

declare global {
  interface Window {
    ym: (id: number, action: string, params?: object) => void
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (consent === 'accepted') {
      loadMetrika()
    } else if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const loadMetrika = () => {
    if (typeof window !== 'undefined' && !window.ym) {
      const script = document.createElement('script')
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.async = true
      script.onload = () => {
        window.ym(METRIKA_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: 'dataLayer'
        })
      }
      document.head.appendChild(script)
    }
  }

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShowBanner(false)
    loadMetrika()
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          Мы используем cookies и Яндекс.Метрику для улучшения работы сайта.{' '}
          <Link href="https://saleswhisper.pro/legal/cookies.html" className="text-indigo-400 hover:underline">
            Подробнее
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/5 transition"
          >
            Отклонить
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}
