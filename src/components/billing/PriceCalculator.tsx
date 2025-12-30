'use client'

import { useState, useMemo } from 'react'
import {
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Sparkles, Film, Calculator, Check,
  TrendingUp, Minus, Plus, Star, Mic
} from 'lucide-react'

// Platform costs per post (free or paid via API)
const PLATFORM_COSTS: Record<string, {
  cost: number
  name: string
  icon: any
  color: string
}> = {
  telegram: { cost: 0.00, name: 'Telegram', icon: MessageSquare, color: '#0088cc' },
  vk: { cost: 0.00, name: 'VKontakte', icon: Users, color: '#4a76a8' },
  instagram: { cost: 0.03, name: 'Instagram', icon: Instagram, color: '#E4405F' },
  facebook: { cost: 0.03, name: 'Facebook', icon: Facebook, color: '#1877F2' },
  tiktok: { cost: 0.06, name: 'TikTok', icon: Music2, color: '#000000' },
  youtube: { cost: 0.09, name: 'YouTube', icon: Youtube, color: '#FF0000' },
  rutube: { cost: 0.03, name: 'RuTube', icon: Video, color: '#00A8E6' },
}

// Image providers with credits (1 credit = 1 Nanobana Flash image)
const IMAGE_PROVIDERS: Record<string, {
  credits: number
  costUsd: number
  name: string
  quality: number
  description: string
  strengths: string[]
  bestFor: string
  badge?: string
}> = {
  nanobana: {
    credits: 1,
    costUsd: 0.06,
    name: 'Nano Banana Flash',
    quality: 3,
    description: 'Быстрая генерация, низкая цена',
    strengths: ['Скорость', 'Низкая цена', 'Большие объёмы'],
    bestFor: 'Массовый контент, тестирование идей',
  },
  openai: {
    credits: 2,
    costUsd: 0.12,
    name: 'DALL-E 3',
    quality: 4,
    description: 'Высокое качество, реалистичные изображения',
    strengths: ['Фотореализм', 'Текст на изображениях', 'Сложные сцены'],
    bestFor: 'Маркетинг, реклама, баннеры',
    badge: 'Популярный',
  },
  midjourney: {
    credits: 4,
    costUsd: 0.24,
    name: 'Midjourney',
    quality: 5,
    description: 'Лучшее для маркетинга и арта',
    strengths: ['Художественный стиль', 'Эстетика', 'Маркетинговые материалы'],
    bestFor: 'Премиум контент, брендинг, арт',
    badge: 'Премиум',
  },
  'nanobana-pro': {
    credits: 6,
    costUsd: 0.36,
    name: 'Nano Banana Pro',
    quality: 5,
    description: 'Google Gemini 3 Pro - высокое качество',
    strengths: ['4K разрешение', 'Детализация', 'Сложные промпты'],
    bestFor: 'Печать, премиум материалы',
    badge: '4K',
  },
}

// Video providers with credits (1 credit = 5 sec MiniMax/Kling)
const VIDEO_PROVIDERS: Record<string, {
  creditsPer5sec: number
  costPer5secUsd: number
  name: string
  quality: number
  description: string
  strengths: string[]
  bestFor: string
  badge?: string
}> = {
  minimax: {
    creditsPer5sec: 1,
    costPer5secUsd: 0.24,
    name: 'MiniMax Hailuo',
    quality: 4,
    description: 'Реалистичные движения персонажей',
    strengths: ['Реалистичные движения', 'Персонажи', 'Доступная цена'],
    bestFor: 'Социальные сети, короткие видео',
  },
  kling: {
    creditsPer5sec: 1,
    costPer5secUsd: 0.25,
    name: 'Kling AI',
    quality: 4,
    description: 'Отличное соотношение цена/качество',
    strengths: ['Image-to-video', 'Низкая цена', 'Быстрая генерация'],
    bestFor: 'Анимация изображений, социальные сети',
    badge: 'Рекомендуем',
  },
  runway: {
    creditsPer5sec: 3,
    costPer5secUsd: 0.75,
    name: 'Runway Gen-3',
    quality: 5,
    description: 'Лучшее качество видео',
    strengths: ['Премиум качество', 'Гибкая длительность', 'Контроль движения'],
    bestFor: 'Реклама, премиум контент',
    badge: 'Премиум',
  },
}

// Subscription plans with credits
const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 990,
    imageCredits: 50,
    videoCredits: 6,
    ttsCredits: 20,
    features: ['50 изображений*', '6 видео (30 сек)*', 'TTS 20 000 символов', '30 постов', 'Email поддержка'],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2990,
    imageCredits: 200,
    videoCredits: 24,
    ttsCredits: 100,
    features: ['200 изображений*', '24 видео (2 мин)*', 'TTS 100 000 символов', '100 постов', 'Приоритетная поддержка'],
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 9990,
    imageCredits: 1000,
    videoCredits: 120,
    ttsCredits: 500,
    features: ['1000 изображений*', '120 видео (10 мин)*', 'TTS 500 000 символов', 'Безлимит постов', 'API доступ', 'Выделенная поддержка'],
    highlight: false,
  },
]

interface PriceCalculatorProps {
  onPlanSelect?: (plan: string, price: number) => void
}

export default function PriceCalculator({ onPlanSelect }: PriceCalculatorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['telegram', 'vk', 'instagram'])
  const [postsPerMonth, setPostsPerMonth] = useState(30)
  const [imageProvider, setImageProvider] = useState('openai')
  const [imagesPerMonth, setImagesPerMonth] = useState(30)
  const [videoProvider, setVideoProvider] = useState('kling')
  const [videoSecondsPerMonth, setVideoSecondsPerMonth] = useState(30)
  const [includeTTS, setIncludeTTS] = useState(false)
  const [ttsCharsPerMonth, setTtsCharsPerMonth] = useState(10000)

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const calculation = useMemo(() => {
    const imgProvider = IMAGE_PROVIDERS[imageProvider]
    const vidProvider = VIDEO_PROVIDERS[videoProvider]

    // Credits needed
    const imageCreditsNeeded = imagesPerMonth * imgProvider.credits
    const videoCreditsNeeded = Math.ceil(videoSecondsPerMonth / 5) * vidProvider.creditsPer5sec
    const ttsCreditsNeeded = includeTTS ? Math.ceil(ttsCharsPerMonth / 1000) : 0

    // Find best plan
    let recommendedPlan = SUBSCRIPTION_PLANS[0]
    for (const plan of SUBSCRIPTION_PLANS) {
      if (
        plan.imageCredits >= imageCreditsNeeded &&
        plan.videoCredits >= videoCreditsNeeded &&
        plan.ttsCredits >= ttsCreditsNeeded
      ) {
        recommendedPlan = plan
        break
      }
    }

    // Calculate overage (if needed)
    const imageOverage = Math.max(0, imageCreditsNeeded - recommendedPlan.imageCredits)
    const videoOverage = Math.max(0, videoCreditsNeeded - recommendedPlan.videoCredits)
    const ttsOverage = Math.max(0, ttsCreditsNeeded - recommendedPlan.ttsCredits)

    // Overage costs (per credit)
    const overageCostUsd = imageOverage * 0.06 + videoOverage * 0.25 + ttsOverage * 0.05
    const overageCostRub = Math.round(overageCostUsd * 92)

    // Platform costs
    const platformCostUsd = selectedPlatforms.reduce(
      (sum, p) => sum + (PLATFORM_COSTS[p]?.cost || 0),
      0
    ) * postsPerMonth
    const platformCostRub = Math.round(platformCostUsd * 92)

    const totalRub = recommendedPlan.price + overageCostRub + platformCostRub

    // Equivalent images with selected provider
    const equivalentImages = Math.floor(recommendedPlan.imageCredits / imgProvider.credits)
    const equivalentVideoSec = Math.floor(recommendedPlan.videoCredits / vidProvider.creditsPer5sec) * 5

    return {
      imageCreditsNeeded,
      videoCreditsNeeded,
      ttsCreditsNeeded,
      recommendedPlan,
      equivalentImages,
      equivalentVideoSec,
      overageCostRub,
      platformCostRub,
      totalRub,
    }
  }, [selectedPlatforms, postsPerMonth, imageProvider, imagesPerMonth, videoProvider, videoSecondsPerMonth, includeTTS, ttsCharsPerMonth])

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Platforms selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">1</span>
          Выберите платформы
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(PLATFORM_COSTS).map(([id, platform]) => {
            const Icon = platform.icon
            const isSelected = selectedPlatforms.includes(id)
            return (
              <button
                key={id}
                onClick={() => togglePlatform(id)}
                className={`p-4 rounded-xl border transition flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-white/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: platform.color + '20' }}
                >
                  <Icon className="w-5 h-5" style={{ color: platform.color }} />
                </div>
                <span className="text-sm">{platform.name}</span>
                {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Image provider selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">2</span>
          Генерация изображений
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(IMAGE_PROVIDERS).map(([id, provider]) => {
            const isSelected = imageProvider === id
            return (
              <button
                key={id}
                onClick={() => setImageProvider(id)}
                className={`p-4 rounded-xl border text-left transition relative ${
                  isSelected
                    ? 'bg-white/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {provider.badge && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
                    {provider.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(provider.quality)}
                </div>
                <p className="text-xs text-gray-400 mb-2">{provider.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-400">{provider.credits} кред.</span>
                  <span className="text-xs text-gray-500">${provider.costUsd}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-400">Изображений в месяц:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImagesPerMonth(Math.max(5, imagesPerMonth - 5))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={imagesPerMonth}
              onChange={(e) => setImagesPerMonth(Number(e.target.value))}
              className="w-32 accent-indigo-500"
            />
            <button
              onClick={() => setImagesPerMonth(Math.min(200, imagesPerMonth + 5))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center font-bold">{imagesPerMonth}</span>
          </div>
        </div>

        <div className="mt-2 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm">
          <span className="text-indigo-300">
            С выбранным провайдером: {calculation.equivalentImages} изображений в вашем тарифе
          </span>
        </div>
      </div>

      {/* Video provider selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">3</span>
          Генерация видео
          <Film className="w-4 h-4 text-purple-400" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(VIDEO_PROVIDERS).map(([id, provider]) => {
            const isSelected = videoProvider === id
            return (
              <button
                key={id}
                onClick={() => setVideoProvider(id)}
                className={`p-4 rounded-xl border text-left transition relative ${
                  isSelected
                    ? 'bg-white/10 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {provider.badge && (
                  <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs ${
                    provider.badge === 'Премиум' ? 'bg-purple-500' : 'bg-green-500'
                  } text-white`}>
                    {provider.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(provider.quality)}
                </div>
                <p className="text-xs text-gray-400 mb-2">{provider.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-400">{provider.creditsPer5sec} кред./5сек</span>
                  <span className="text-xs text-gray-500">${provider.costPer5secUsd}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-400">Секунд видео в месяц:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVideoSecondsPerMonth(Math.max(5, videoSecondsPerMonth - 5))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={videoSecondsPerMonth}
              onChange={(e) => setVideoSecondsPerMonth(Number(e.target.value))}
              className="w-32 accent-purple-500"
            />
            <button
              onClick={() => setVideoSecondsPerMonth(Math.min(120, videoSecondsPerMonth + 5))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center font-bold">{videoSecondsPerMonth}</span>
          </div>
        </div>

        <div className="mt-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm">
          <span className="text-purple-300">
            С выбранным провайдером: {calculation.equivalentVideoSec} секунд видео в вашем тарифе
          </span>
        </div>
      </div>

      {/* TTS section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">4</span>
          Озвучка (TTS)
          <Mic className="w-4 h-4 text-green-400" />
        </h3>
        <div className="flex items-start gap-4">
          <button
            onClick={() => setIncludeTTS(!includeTTS)}
            className={`p-4 rounded-xl border transition flex items-center gap-3 ${
              includeTTS
                ? 'bg-white/10 border-green-500'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              includeTTS ? 'bg-green-500 border-green-500' : 'border-white/30'
            }`}>
              {includeTTS && <Check className="w-3 h-3" />}
            </div>
            <div className="text-left">
              <span className="font-medium">OpenAI TTS</span>
              <p className="text-xs text-gray-400">1 кредит = 1000 символов</p>
            </div>
          </button>

          {includeTTS && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400 text-sm">Символов:</span>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={ttsCharsPerMonth}
                onChange={(e) => setTtsCharsPerMonth(Number(e.target.value))}
                className="w-32 accent-green-500"
              />
              <span className="font-bold w-20">{(ttsCharsPerMonth / 1000).toFixed(0)}K</span>
            </div>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold">Расчет стоимости</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Кредиты на изображения:</span>
              <span>{calculation.imageCreditsNeeded} из {calculation.recommendedPlan.imageCredits}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Кредиты на видео:</span>
              <span>{calculation.videoCreditsNeeded} из {calculation.recommendedPlan.videoCredits}</span>
            </div>
            {includeTTS && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Кредиты на TTS:</span>
                <span>{calculation.ttsCreditsNeeded} из {calculation.recommendedPlan.ttsCredits}</span>
              </div>
            )}
            {calculation.overageCostRub > 0 && (
              <div className="flex justify-between text-sm text-yellow-400">
                <span>Перерасход:</span>
                <span>+{calculation.overageCostRub.toLocaleString()} ₽</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="font-semibold">Итого в месяц:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{calculation.totalRub.toLocaleString()} ₽</div>
                  <div className="text-sm text-gray-400">тариф {calculation.recommendedPlan.name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-indigo-400">Что входит в тариф</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              {calculation.recommendedPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              * При использовании базового провайдера
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3">Выберите тариф:</p>
          <div className="flex flex-wrap gap-3">
            {SUBSCRIPTION_PLANS.map(plan => (
              <button
                key={plan.id}
                onClick={() => onPlanSelect?.(plan.id, plan.price)}
                className={`px-6 py-3 rounded-xl border transition ${
                  calculation.recommendedPlan.id === plan.id
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold">{plan.name}</div>
                <div className="text-sm text-gray-300">{plan.price.toLocaleString()} ₽/мес</div>
                <div className="text-xs text-gray-400">{plan.imageCredits} кред. изобр.</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
