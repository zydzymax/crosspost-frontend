'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard, Check, Zap, Crown, Building2,
  ArrowRight, Loader2, ExternalLink
} from 'lucide-react'
import PriceCalculator from '@/components/billing/PriceCalculator'

interface CurrentPlan {
  id: string
  name: string
  price: number
  posts_limit: number
  images_limit: number
  video_seconds_limit: number
  expires_at?: string
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 990,
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '30 постов в месяц',
      '30 AI изображений',
      '3 платформы',
      'Базовая аналитика',
      'Email поддержка',
    ],
    posts_limit: 30,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2990,
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      '100 постов в месяц',
      '100 AI изображений',
      '150 секунд видео',
      'Все платформы',
      'Контент-планирование',
      'Приоритетная поддержка',
    ],
    posts_limit: 100,
  },
  {
    id: 'business',
    name: 'Business',
    price: 9990,
    icon: Building2,
    color: 'from-amber-500 to-orange-500',
    features: [
      'Безлимитные посты',
      '500 AI изображений',
      '600 секунд видео',
      'Все платформы',
      'API доступ',
      'Персональный менеджер',
      'White-label опции',
    ],
    posts_limit: -1,
  },
]

export default function BillingPage() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [showCalculator, setShowCalculator] = useState(true)

  useEffect(() => {
    fetchCurrentPlan()
  }, [])

  const fetchCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setCurrentPlan(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/subscribe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan_id: planId }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.payment_url) {
          window.location.href = data.payment_url
        } else {
          await fetchCurrentPlan()
        }
      }
    } catch (err) {
      console.error('Failed to subscribe:', err)
    } finally {
      setSubscribing(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Тарифы и биллинг</h1>
        <p className="text-gray-400">
          Выберите подходящий тариф или рассчитайте стоимость под ваши нужды
        </p>
      </div>

      {/* Current plan */}
      {currentPlan && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-indigo-400">Текущий тариф</span>
              <h2 className="text-2xl font-bold">{currentPlan.name}</h2>
              {currentPlan.expires_at && (
                <p className="text-sm text-gray-400">
                  Активен до: {new Date(currentPlan.expires_at).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentPlan.price.toLocaleString()} ₽</div>
              <span className="text-gray-400">/месяц</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm text-gray-400">Постов</div>
              <div className="font-semibold">
                {currentPlan.posts_limit === -1 ? 'Безлимит' : currentPlan.posts_limit}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm text-gray-400">Изображений</div>
              <div className="font-semibold">{currentPlan.images_limit}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-sm text-gray-400">Видео (сек)</div>
              <div className="font-semibold">{currentPlan.video_seconds_limit}</div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle calculator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {showCalculator ? 'Калькулятор стоимости' : 'Тарифные планы'}
        </h2>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
        >
          {showCalculator ? 'Показать тарифы' : 'Открыть калькулятор'}
        </button>
      </div>

      {showCalculator ? (
        <PriceCalculator
          onPlanSelect={(planId, price) => {
            setShowCalculator(false)
          }}
        />
      ) : (
        /* Plans grid */
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = currentPlan?.id === plan.id

            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-2xl border transition ${
                  plan.popular
                    ? 'bg-white/10 border-purple-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-medium">
                    Популярный
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400">₽/мес</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || subscribing === plan.id}
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                    isCurrent
                      ? 'bg-white/10 text-gray-400 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Оформление...
                    </>
                  ) : isCurrent ? (
                    'Текущий тариф'
                  ) : (
                    <>
                      Выбрать
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Часто задаваемые вопросы</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Как работает оплата?',
              a: 'Оплата списывается ежемесячно. Вы можете отменить подписку в любой момент.'
            },
            {
              q: 'Что происходит при превышении лимитов?',
              a: 'При достижении лимита вы получите уведомление. Можете докупить дополнительные посты или перейти на старший тариф.'
            },
            {
              q: 'Можно ли сменить тариф?',
              a: 'Да, вы можете перейти на другой тариф в любое время. При переходе на старший тариф разница списывается сразу.'
            },
            {
              q: 'Есть ли пробный период?',
              a: 'Да, новые пользователи получают 7 дней бесплатного Demo-периода с ограниченным функционалом.'
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-medium mb-2">{item.q}</h4>
              <p className="text-sm text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">Нужен индивидуальный тариф?</h3>
          <p className="text-sm text-gray-400">
            Свяжитесь с нами для обсуждения корпоративных условий
          </p>
        </div>
        <a
          href="https://t.me/sovani_support"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium flex items-center gap-2"
        >
          Связаться
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
