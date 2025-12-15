'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Sparkles, Film, Calculator, Check,
  TrendingUp, Minus, Plus
} from 'lucide-react'

// Platform costs per post (3x markup from cost)
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

// Image generation costs per image
const IMAGE_PROVIDERS: Record<string, {
  cost: number
  name: string
  quality: string
  description: string
}> = {
  none: { cost: 0, name: 'Без генерации', quality: '', description: 'Загружайте свои изображения' },
  nanobana: { cost: 0.03, name: 'Nanobana', quality: 'Базовое', description: 'Бюджетная генерация' },
  openai: { cost: 0.12, name: 'DALL-E 3', quality: 'Высокое', description: 'OpenAI, реалистичные изображения' },
  midjourney: { cost: 0.24, name: 'Midjourney', quality: 'Премиум', description: 'Лучшее качество, художественный стиль' },
}

// Video generation cost
const VIDEO_COST_PER_SECOND = 0.15

// USD to RUB rate
const USD_TO_RUB = 92

interface PriceCalculatorProps {
  onPlanSelect?: (plan: string, price: number) => void
}

export default function PriceCalculator({ onPlanSelect }: PriceCalculatorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['telegram', 'vk', 'instagram'])
  const [postsPerMonth, setPostsPerMonth] = useState(30)
  const [imageProvider, setImageProvider] = useState('openai')
  const [imagesPerPost, setImagesPerPost] = useState(1)
  const [includeVideo, setIncludeVideo] = useState(false)
  const [videoSecondsPerPost, setVideoSecondsPerPost] = useState(5)

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const calculation = useMemo(() => {
    // Platform costs
    const platformCost = selectedPlatforms.reduce(
      (sum, p) => sum + (PLATFORM_COSTS[p]?.cost || 0),
      0
    ) * postsPerMonth

    // Image generation costs
    const imageCost = imageProvider !== 'none'
      ? IMAGE_PROVIDERS[imageProvider].cost * imagesPerPost * postsPerMonth
      : 0

    // Video generation costs
    const videoCost = includeVideo
      ? VIDEO_COST_PER_SECOND * videoSecondsPerPost * postsPerMonth
      : 0

    const totalUsd = platformCost + imageCost + videoCost
    const totalRub = Math.round(totalUsd * USD_TO_RUB)

    // Estimate manual cost (based on SMM manager hourly rate)
    const hoursPerPost = 2 // Average time to create and publish manually
    const smmHourlyRate = 15 // USD
    const manualCost = postsPerMonth * hoursPerPost * smmHourlyRate * selectedPlatforms.length / 3
    const savings = Math.max(0, Math.round((1 - totalUsd / manualCost) * 100))

    return {
      platformCost,
      imageCost,
      videoCost,
      totalUsd: Math.round(totalUsd * 100) / 100,
      totalRub,
      savings,
      manualCost: Math.round(manualCost),
    }
  }, [selectedPlatforms, postsPerMonth, imageProvider, imagesPerPost, includeVideo, videoSecondsPerPost])

  const recommendedPlan = useMemo(() => {
    if (calculation.totalRub <= 990) return 'starter'
    if (calculation.totalRub <= 2990) return 'pro'
    return 'business'
  }, [calculation.totalRub])

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
                {isSelected && (
                  <Check className="w-4 h-4 text-indigo-400" />
                )}
                <span className="text-xs text-gray-500">
                  {platform.cost > 0 ? `$${platform.cost}/пост` : 'Бесплатно'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Posts per month */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">2</span>
          Количество постов в месяц
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPostsPerMonth(Math.max(1, postsPerMonth - 5))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="100"
              value={postsPerMonth}
              onChange={(e) => setPostsPerMonth(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <button
            onClick={() => setPostsPerMonth(Math.min(100, postsPerMonth + 5))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-20 text-center">
            <span className="text-2xl font-bold">{postsPerMonth}</span>
            <span className="text-gray-400 text-sm block">постов</span>
          </div>
        </div>
      </div>

      {/* Image generation */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">3</span>
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
                className={`p-4 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-white/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                {provider.quality && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-400 mb-2">
                    {provider.quality}
                  </span>
                )}
                <p className="text-xs text-gray-400">{provider.description}</p>
                <p className="text-sm text-gray-300 mt-2">
                  {provider.cost > 0 ? `$${provider.cost} / изображение` : 'Бесплатно'}
                </p>
              </button>
            )
          })}
        </div>

        {imageProvider !== 'none' && (
          <div className="mt-4 flex items-center gap-4">
            <span className="text-gray-400">Изображений на пост:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setImagesPerPost(n)}
                  className={`w-10 h-10 rounded-lg border transition ${
                    imagesPerPost === n
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video generation */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">4</span>
          Генерация видео
          <Film className="w-4 h-4 text-purple-400" />
        </h3>
        <div className="flex items-start gap-4">
          <button
            onClick={() => setIncludeVideo(!includeVideo)}
            className={`p-4 rounded-xl border transition flex items-center gap-3 ${
              includeVideo
                ? 'bg-white/10 border-purple-500'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              includeVideo ? 'bg-purple-500 border-purple-500' : 'border-white/30'
            }`}>
              {includeVideo && <Check className="w-3 h-3" />}
            </div>
            <div className="text-left">
              <span className="font-medium">Runway ML Gen-3</span>
              <p className="text-xs text-gray-400">${VIDEO_COST_PER_SECOND} / секунда видео</p>
            </div>
          </button>

          {includeVideo && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">Секунд на пост:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={videoSecondsPerPost}
                onChange={(e) => setVideoSecondsPerPost(Number(e.target.value))}
                className="w-32 accent-purple-500"
              />
              <span className="font-bold w-8">{videoSecondsPerPost}</span>
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
              <span className="text-gray-400">Публикация ({selectedPlatforms.length} платформ × {postsPerMonth} постов)</span>
              <span>${calculation.platformCost.toFixed(2)}</span>
            </div>
            {imageProvider !== 'none' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Генерация изображений ({imagesPerPost} × {postsPerMonth})</span>
                <span>${calculation.imageCost.toFixed(2)}</span>
              </div>
            )}
            {includeVideo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Генерация видео ({videoSecondsPerPost}сек × {postsPerMonth})</span>
                <span>${calculation.videoCost.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="font-semibold">Итого в месяц:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{calculation.totalRub.toLocaleString()} ₽</div>
                  <div className="text-sm text-gray-400">${calculation.totalUsd}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Экономия</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              По сравнению с ручным ведением SMM-менеджером:
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400">{calculation.savings}%</span>
              <span className="text-gray-400">экономии</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ручное ведение: ~${calculation.manualCost}/мес
            </p>
          </div>
        </div>

        {/* Recommended plan */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3">Рекомендуемый тариф:</p>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'starter', name: 'Starter', price: 990, limit: '30 постов' },
              { id: 'pro', name: 'Pro', price: 2990, limit: '100 постов' },
              { id: 'business', name: 'Business', price: 9990, limit: 'Безлимит' },
            ].map(plan => (
              <button
                key={plan.id}
                onClick={() => onPlanSelect?.(plan.id, plan.price)}
                className={`px-6 py-3 rounded-xl border transition ${
                  recommendedPlan === plan.id
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold">{plan.name}</div>
                <div className="text-sm text-gray-300">{plan.price.toLocaleString()} ₽/мес</div>
                <div className="text-xs text-gray-400">{plan.limit}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
