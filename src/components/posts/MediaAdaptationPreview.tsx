'use client'

import { useState } from 'react'
import {
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Check, Info, Crop, Maximize2,
  User, Eye
} from 'lucide-react'

// Platform media specifications
const PLATFORM_MEDIA_SPECS: Record<string, {
  name: string
  icon: any
  color: string
  formats: {
    name: string
    aspectRatio: string
    dimensions: string
    preferred: string
  }[]
}> = {
  telegram: {
    name: 'Telegram',
    icon: MessageSquare,
    color: '#0088cc',
    formats: [
      { name: 'Пост', aspectRatio: 'Любой', dimensions: 'до 2560×2560', preferred: 'Гибкий' },
    ],
  },
  vk: {
    name: 'VKontakte',
    icon: Users,
    color: '#4a76a8',
    formats: [
      { name: 'Пост', aspectRatio: '16:9', dimensions: '1920×1080', preferred: 'Горизонтальный' },
      { name: 'История', aspectRatio: '9:16', dimensions: '1080×1920', preferred: 'Вертикальный' },
    ],
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    formats: [
      { name: 'Лента', aspectRatio: '4:5', dimensions: '1080×1350', preferred: 'Портретный' },
      { name: 'История/Reels', aspectRatio: '9:16', dimensions: '1080×1920', preferred: 'Вертикальный' },
      { name: 'Квадрат', aspectRatio: '1:1', dimensions: '1080×1080', preferred: 'Квадратный' },
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    formats: [
      { name: 'Лента', aspectRatio: '16:9', dimensions: '1920×1080', preferred: 'Горизонтальный' },
      { name: 'Reels', aspectRatio: '9:16', dimensions: '1080×1920', preferred: 'Вертикальный' },
      { name: 'Квадрат', aspectRatio: '1:1', dimensions: '1080×1080', preferred: 'Квадратный' },
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: Music2,
    color: '#000000',
    formats: [
      { name: 'Видео', aspectRatio: '9:16', dimensions: '1080×1920', preferred: 'Вертикальный' },
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    formats: [
      { name: 'Видео', aspectRatio: '16:9', dimensions: '1920×1080', preferred: 'Горизонтальный' },
      { name: 'Shorts', aspectRatio: '9:16', dimensions: '1080×1920', preferred: 'Вертикальный' },
    ],
  },
  rutube: {
    name: 'RuTube',
    icon: Video,
    color: '#00A8E6',
    formats: [
      { name: 'Видео', aspectRatio: '16:9', dimensions: '1920×1080', preferred: 'Горизонтальный' },
    ],
  },
}

interface MediaAdaptationPreviewProps {
  platforms: string[]
  originalWidth?: number
  originalHeight?: number
  mediaType?: 'image' | 'video'
}

export default function MediaAdaptationPreview({
  platforms,
  originalWidth,
  originalHeight,
  mediaType = 'image',
}: MediaAdaptationPreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0] || 'instagram')

  const originalAspectRatio = originalWidth && originalHeight
    ? (originalWidth / originalHeight).toFixed(2)
    : null

  const getAspectRatioLabel = (ratio: number): string => {
    if (Math.abs(ratio - 1) < 0.05) return '1:1 (Квадрат)'
    if (Math.abs(ratio - 16/9) < 0.1) return '16:9 (Горизонтальный)'
    if (Math.abs(ratio - 9/16) < 0.1) return '9:16 (Вертикальный)'
    if (Math.abs(ratio - 4/5) < 0.1) return '4:5 (Портрет)'
    if (Math.abs(ratio - 4/3) < 0.1) return '4:3'
    if (Math.abs(ratio - 3/4) < 0.1) return '3:4'
    return `${ratio.toFixed(2)}:1`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Crop className="w-4 h-4" />
        <span>Умная адаптация медиа</span>
      </div>

      {/* Original media info */}
      {originalWidth && originalHeight && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Maximize2 className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">Исходный файл</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">
              Размер: <span className="text-white">{originalWidth}×{originalHeight}</span>
            </div>
            <div className="text-gray-400">
              Пропорции: <span className="text-white">{getAspectRatioLabel(originalWidth / originalHeight)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Smart crop info */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-medium text-green-300 mb-1">Умный кроп включён</h4>
            <p className="text-sm text-gray-400">
              AI автоматически определяет лица и важные объекты на изображении.
              Контент будет обрезан так, чтобы сохранить главные элементы без добавления чёрных полос.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User className="w-3 h-3 text-indigo-400" />
            <span>Сохранение лиц</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Eye className="w-3 h-3 text-purple-400" />
            <span>Детекция объектов</span>
          </div>
        </div>
      </div>

      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2">
        {platforms.map(platformId => {
          const spec = PLATFORM_MEDIA_SPECS[platformId]
          if (!spec) return null
          const Icon = spec.icon

          return (
            <button
              key={platformId}
              onClick={() => setSelectedPlatform(platformId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                selectedPlatform === platformId
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" style={{ color: spec.color }} />
              <span className="text-sm">{spec.name}</span>
            </button>
          )
        })}
      </div>

      {/* Selected platform specs */}
      {PLATFORM_MEDIA_SPECS[selectedPlatform] && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            {(() => {
              const Icon = PLATFORM_MEDIA_SPECS[selectedPlatform].icon
              return <Icon className="w-4 h-4" style={{ color: PLATFORM_MEDIA_SPECS[selectedPlatform].color }} />
            })()}
            Форматы для {PLATFORM_MEDIA_SPECS[selectedPlatform].name}
          </h4>

          <div className="space-y-2">
            {PLATFORM_MEDIA_SPECS[selectedPlatform].formats.map((format, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div>
                  <div className="font-medium text-sm">{format.name}</div>
                  <div className="text-xs text-gray-500">{format.preferred}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-indigo-400">{format.aspectRatio}</div>
                  <div className="text-xs text-gray-500">{format.dimensions}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Adaptation preview */}
          <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-sm text-indigo-300">
              <Info className="w-4 h-4" />
              <span>
                {mediaType === 'video' ? 'Видео' : 'Изображение'} будет автоматически адаптировано
                под формат {PLATFORM_MEDIA_SPECS[selectedPlatform].formats[0].aspectRatio}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
