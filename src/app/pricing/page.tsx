'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Send, Check, ArrowLeft, CreditCard, FileText,
  QrCode, Loader2, Copy, CheckCircle2, Sparkles, Film,
  Star, Mic, Image as ImageIcon, Zap
} from 'lucide-react'
import PriceCalculator from '@/components/billing/PriceCalculator'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 990,
    period: 'месяц',
    description: 'Для начинающих авторов',
    features: [
      '50 кредитов на изображения',
      '6 кредитов на видео (30 сек)',
      '20 000 символов TTS',
      '30 постов в месяц',
      'Email поддержка',
    ],
    imageCredits: 50,
    videoCredits: 6,
    ttsCredits: 20,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2990,
    period: 'месяц',
    description: 'Для активных SMM',
    features: [
      '200 кредитов на изображения',
      '24 кредита на видео (2 мин)',
      '100 000 символов TTS',
      '100 постов в месяц',
      'Приоритетная поддержка',
    ],
    imageCredits: 200,
    videoCredits: 24,
    ttsCredits: 100,
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 9990,
    period: 'месяц',
    description: 'Для агентств и команд',
    features: [
      '1000 кредитов на изображения',
      '120 кредитов на видео (10 мин)',
      '500 000 символов TTS',
      'Безлимит постов',
      'API доступ',
      'Выделенная поддержка',
    ],
    imageCredits: 1000,
    videoCredits: 120,
    ttsCredits: 500,
    highlight: false,
  },
]

// AI Providers comparison data
const imageProviders = [
  {
    id: 'nanobana',
    name: 'Nano Banana Flash',
    credits: 1,
    price: '$0.06',
    quality: 3,
    speed: 'Быстро',
    strengths: ['Скорость', 'Низкая цена', 'Большие объёмы'],
    bestFor: 'Массовый контент',
  },
  {
    id: 'openai',
    name: 'DALL-E 3',
    credits: 2,
    price: '$0.12',
    quality: 4,
    speed: 'Средне',
    strengths: ['Фотореализм', 'Текст на картинках', 'Сложные сцены'],
    bestFor: 'Маркетинг, реклама',
    badge: 'Популярный',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    credits: 4,
    price: '$0.24',
    quality: 5,
    speed: 'Средне',
    strengths: ['Арт-стиль', 'Эстетика', 'Брендинг'],
    bestFor: 'Премиум контент',
    badge: 'Премиум',
  },
  {
    id: 'nanobana-pro',
    name: 'Nano Banana Pro',
    credits: 6,
    price: '$0.36',
    quality: 5,
    speed: 'Медленно',
    strengths: ['4K', 'Детализация', 'Сложные промпты'],
    bestFor: 'Печать, премиум',
    badge: '4K',
  },
]

const videoProviders = [
  {
    id: 'minimax',
    name: 'MiniMax Hailuo',
    creditsPer5sec: 1,
    price: '$0.24/5сек',
    quality: 4,
    strengths: ['Реалистичные движения', 'Персонажи'],
    bestFor: 'Социальные сети',
  },
  {
    id: 'kling',
    name: 'Kling AI',
    creditsPer5sec: 1,
    price: '$0.25/5сек',
    quality: 4,
    strengths: ['Image-to-video', 'Быстро', 'Низкая цена'],
    bestFor: 'Анимация изображений',
    badge: 'Рекомендуем',
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    creditsPer5sec: 3,
    price: '$0.75/5сек',
    quality: 5,
    strengths: ['Премиум качество', 'Контроль движения'],
    bestFor: 'Реклама, премиум',
    badge: 'Премиум',
  },
]

type PaymentMethod = 'card' | 'invoice' | 'sbp'
type ViewMode = 'plans' | 'calculator' | 'providers'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [invoiceGenerated, setInvoiceGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('plans')

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (paymentMethod === 'invoice') {
      setInvoiceGenerated(true)
    } else {
      alert('Оплата картой и СБП скоро будет доступна. Пока используйте оплату по счёту.')
    }

    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ))
  }

  const invoiceDetails = {
    number: `INV-${Date.now().toString().slice(-8)}`,
    recipient: 'ИП Гладких Виталий Олегович',
    inn: '381705889083',
    account: '40802810220000838595',
    bank: 'ООО "Банк Точка"',
    bik: '044525104',
    corrAccount: '30101810745374525104',
    amount: selectedPlanData?.price || 0,
    purpose: `Оплата подписки Crosspost ${selectedPlanData?.name || ''} на 1 месяц`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Тарифы и цены</h1>
          <p className="text-gray-400">Выберите подходящий тариф или рассчитайте стоимость</p>
        </div>

        {/* View mode tabs */}
        {!selectedPlan && (
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setViewMode('plans')}
              className={`px-6 py-2 rounded-lg transition ${
                viewMode === 'plans'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Тарифы
            </button>
            <button
              onClick={() => setViewMode('calculator')}
              className={`px-6 py-2 rounded-lg transition ${
                viewMode === 'calculator'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Калькулятор
            </button>
            <button
              onClick={() => setViewMode('providers')}
              className={`px-6 py-2 rounded-lg transition ${
                viewMode === 'providers'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              AI-провайдеры
            </button>
          </div>
        )}

        {!selectedPlan ? (
          <>
            {viewMode === 'plans' && (
              /* Plan Selection */
              <>
                {/* Credit explanation */}
                <div className="mb-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-indigo-300">Как работают кредиты?</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    1 кредит = 1 изображение Nano Banana Flash. Дорогие провайдеры расходуют больше кредитов:
                    DALL-E = 2 кред., Midjourney = 4 кред., Nano Pro = 6 кред.
                    Видео: 1 кредит = 5 секунд (MiniMax/Kling) или 3 кредита = 5 секунд (Runway).
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-2xl border transition text-left relative ${
                        plan.highlight
                          ? 'bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-500'
                          : 'bg-white/5 border-white/10 hover:border-indigo-500/50'
                      }`}
                    >
                      {plan.highlight && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 rounded-full text-xs font-medium">
                          Популярный
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-bold">{plan.price.toLocaleString()}₽</span>
                        <span className="text-gray-400">/ {plan.period}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                      {/* Credits summary */}
                      <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-white/5">
                        <div className="text-center">
                          <ImageIcon className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                          <div className="text-sm font-bold">{plan.imageCredits}</div>
                          <div className="text-xs text-gray-500">изобр.</div>
                        </div>
                        <div className="text-center">
                          <Film className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                          <div className="text-sm font-bold">{plan.videoCredits}</div>
                          <div className="text-xs text-gray-500">видео</div>
                        </div>
                        <div className="text-center">
                          <Mic className="w-4 h-4 mx-auto mb-1 text-green-400" />
                          <div className="text-sm font-bold">{plan.ttsCredits}K</div>
                          <div className="text-xs text-gray-500">TTS</div>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'calculator' && (
              /* Price Calculator */
              <PriceCalculator onPlanSelect={(id, price) => setSelectedPlan(id)} />
            )}

            {viewMode === 'providers' && (
              /* AI Providers Comparison */
              <div className="space-y-8">
                {/* Image providers */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Генерация изображений
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {imageProviders.map(provider => (
                      <div
                        key={provider.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 relative"
                      >
                        {provider.badge && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
                            {provider.badge}
                          </span>
                        )}
                        <h3 className="font-semibold mb-2">{provider.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(provider.quality)}
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-indigo-400 font-semibold">{provider.credits} кред.</span>
                          <span className="text-gray-400">{provider.price}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Скорость: {provider.speed}</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.strengths.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-xs">{s}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          Лучше всего для: {provider.bestFor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video providers */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-400" />
                    Генерация видео
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {videoProviders.map(provider => (
                      <div
                        key={provider.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 relative"
                      >
                        {provider.badge && (
                          <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs text-white ${
                            provider.badge === 'Премиум' ? 'bg-purple-500' : 'bg-green-500'
                          }`}>
                            {provider.badge}
                          </span>
                        )}
                        <h3 className="font-semibold mb-2">{provider.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(provider.quality)}
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-purple-400 font-semibold">{provider.creditsPer5sec} кред./5сек</span>
                          <span className="text-gray-400">{provider.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.strengths.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-xs">{s}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          Лучше всего для: {provider.bestFor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TTS */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-green-400" />
                    Озвучка текста (TTS)
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="font-semibold mb-2">OpenAI TTS</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(4)}
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-green-400 font-semibold">1 кред./1K символов</span>
                        <span className="text-gray-400">$0.045/1K</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        6 голосов: alloy, echo, fable, onyx, nova, shimmer
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">Натуральность</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">Многоязычность</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">Быстро</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs bg-purple-500 text-white">
                        HD
                      </span>
                      <h3 className="font-semibold mb-2">OpenAI TTS HD</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(5)}
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-green-400 font-semibold">2 кред./1K символов</span>
                        <span className="text-gray-400">$0.09/1K</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Высокое качество для подкастов и профессиональной озвучки
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">HD качество</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">Подкасты</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs">Профессионально</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <h3 className="text-lg font-semibold mb-2">Готовы начать?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Выберите тариф или рассчитайте стоимость под ваши нужды
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setViewMode('plans')}
                      className="px-6 py-2 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-600 transition"
                    >
                      Выбрать тариф
                    </button>
                    <button
                      onClick={() => setViewMode('calculator')}
                      className="px-6 py-2 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition"
                    >
                      Рассчитать
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : !paymentMethod ? (
          /* Payment Method Selection */
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setSelectedPlan(null)}
              className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к тарифам
            </button>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <h3 className="font-bold mb-2">{selectedPlanData?.name}</h3>
              <p className="text-2xl font-bold">{selectedPlanData?.price.toLocaleString()}₽ <span className="text-sm text-gray-400 font-normal">/ месяц</span></p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-bold text-indigo-400">{selectedPlanData?.imageCredits}</div>
                  <div className="text-xs text-gray-500">изобр.</div>
                </div>
                <div>
                  <div className="font-bold text-purple-400">{selectedPlanData?.videoCredits}</div>
                  <div className="text-xs text-gray-500">видео</div>
                </div>
                <div>
                  <div className="font-bold text-green-400">{selectedPlanData?.ttsCredits}K</div>
                  <div className="text-xs text-gray-500">TTS</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Способ оплаты</h2>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('invoice')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Счёт на оплату</p>
                  <p className="text-sm text-gray-400">Для юридических лиц и ИП</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4 opacity-60"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Банковская карта</p>
                  <p className="text-sm text-gray-400">Visa, Mastercard, МИР</p>
                </div>
                <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Скоро</span>
              </button>

              <button
                onClick={() => setPaymentMethod('sbp')}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition flex items-center gap-4 opacity-60"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">СБП (QR-код)</p>
                  <p className="text-sm text-gray-400">Мгновенный перевод</p>
                </div>
                <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Скоро</span>
              </button>
            </div>
          </div>
        ) : invoiceGenerated ? (
          /* Invoice Generated */
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Счёт сформирован</h2>
              <p className="text-gray-400">Оплатите по реквизитам ниже</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Номер счёта</p>
                <p className="font-mono">{invoiceDetails.number}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Получатель</p>
                <p>{invoiceDetails.recipient}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">ИНН</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono">{invoiceDetails.inn}</p>
                  <button onClick={() => copyToClipboard(invoiceDetails.inn)} className="text-indigo-400 hover:text-indigo-300">
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Расчётный счёт</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{invoiceDetails.account}</p>
                  <button onClick={() => copyToClipboard(invoiceDetails.account)} className="text-indigo-400 hover:text-indigo-300">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Банк</p>
                <p>{invoiceDetails.bank}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">БИК</p>
                  <p className="font-mono">{invoiceDetails.bik}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Корр. счёт</p>
                  <p className="font-mono text-xs">{invoiceDetails.corrAccount}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-1">Сумма к оплате</p>
                <p className="text-2xl font-bold">{invoiceDetails.amount.toLocaleString()}₽</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Назначение платежа</p>
                <p className="text-sm">{invoiceDetails.purpose}</p>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              После оплаты подписка активируется автоматически в течение 24 часов.
              <br />
              Если возникли вопросы — напишите на <a href="mailto:support@saleswhisper.pro" className="text-indigo-400">support@saleswhisper.pro</a>
            </p>

            <Link
              href="/dashboard"
              className="block w-full mt-6 py-3 bg-indigo-500 rounded-xl font-medium text-center hover:bg-indigo-600 transition"
            >
              Вернуться в личный кабинет
            </Link>
          </div>
        ) : (
          /* Payment Processing */
          <div className="max-w-md mx-auto text-center">
            <button
              onClick={() => setPaymentMethod(null)}
              className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
                  <p>Формирование счёта...</p>
                </>
              ) : (
                <>
                  <p className="mb-6">
                    Вы выбрали оплату{' '}
                    {paymentMethod === 'card' && 'картой'}
                    {paymentMethod === 'invoice' && 'по счёту'}
                    {paymentMethod === 'sbp' && 'через СБП'}
                  </p>
                  <button
                    onClick={handlePayment}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium"
                  >
                    {paymentMethod === 'invoice' ? 'Сформировать счёт' : 'Оплатить'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
