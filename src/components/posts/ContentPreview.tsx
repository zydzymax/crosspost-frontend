'use client'

import { useState, useMemo } from 'react'
import {
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, AlertTriangle, Check, Scissors,
  Hash, AtSign, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react'

// Platform limits from publishing_rules.yml
const PLATFORM_LIMITS: Record<string, {
  name: string
  icon: any
  color: string
  caption: { max: number; min: number }
  hashtags: { max: number; maxLength: number }
  mentions: { max: number }
  links: { allowed: boolean; max: number }
  media: { required: boolean; maxCount: number }
}> = {
  telegram: {
    name: 'Telegram',
    icon: MessageSquare,
    color: '#0088cc',
    caption: { max: 4096, min: 0 },
    hashtags: { max: 10, maxLength: 50 },
    mentions: { max: 20 },
    links: { allowed: true, max: 10 },
    media: { required: false, maxCount: 10 },
  },
  vk: {
    name: 'VKontakte',
    icon: Users,
    color: '#4a76a8',
    caption: { max: 15000, min: 1 },
    hashtags: { max: 10, maxLength: 50 },
    mentions: { max: 10 },
    links: { allowed: true, max: 5 },
    media: { required: false, maxCount: 10 },
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    caption: { max: 2200, min: 1 },
    hashtags: { max: 30, maxLength: 100 },
    mentions: { max: 20 },
    links: { allowed: true, max: 1 },
    media: { required: true, maxCount: 10 },
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    caption: { max: 63206, min: 0 },
    hashtags: { max: 30, maxLength: 100 },
    mentions: { max: 50 },
    links: { allowed: true, max: 10 },
    media: { required: false, maxCount: 10 },
  },
  tiktok: {
    name: 'TikTok',
    icon: Music2,
    color: '#000000',
    caption: { max: 150, min: 1 },
    hashtags: { max: 5, maxLength: 25 },
    mentions: { max: 5 },
    links: { allowed: false, max: 0 },
    media: { required: true, maxCount: 1 },
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    caption: { max: 5000, min: 1 },
    hashtags: { max: 15, maxLength: 50 },
    mentions: { max: 10 },
    links: { allowed: true, max: 10 },
    media: { required: true, maxCount: 1 },
  },
  rutube: {
    name: 'RuTube',
    icon: Video,
    color: '#00A8E6',
    caption: { max: 5000, min: 10 },
    hashtags: { max: 20, maxLength: 50 },
    mentions: { max: 10 },
    links: { allowed: true, max: 5 },
    media: { required: true, maxCount: 1 },
  },
}

interface ContentPreviewProps {
  text: string
  platforms: string[]
  mediaCount?: number
  onTextChange?: (text: string) => void
}

interface ValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
  adaptedText: string
  stats: {
    charCount: number
    hashtagCount: number
    mentionCount: number
    linkCount: number
  }
}

export default function ContentPreview({
  text,
  platforms,
  mediaCount = 0,
  onTextChange,
}: ContentPreviewProps) {
  const [activePlatform, setActivePlatform] = useState(platforms[0] || 'telegram')

  const extractStats = (content: string) => {
    const hashtags = content.match(/#\w+/g) || []
    const mentions = content.match(/@\w+/g) || []
    const links = content.match(/https?:\/\/[^\s]+/g) || []
    return {
      charCount: content.length,
      hashtagCount: hashtags.length,
      mentionCount: mentions.length,
      linkCount: links.length,
    }
  }

  const validateForPlatform = (content: string, platformId: string): ValidationResult => {
    const limits = PLATFORM_LIMITS[platformId]
    if (!limits) {
      return {
        valid: true,
        warnings: [],
        errors: [],
        adaptedText: content,
        stats: extractStats(content),
      }
    }

    const warnings: string[] = []
    const errors: string[] = []
    let adaptedText = content
    const stats = extractStats(content)

    // Check caption length
    if (stats.charCount > limits.caption.max) {
      errors.push(`Текст слишком длинный (${stats.charCount}/${limits.caption.max} символов)`)
      // Truncate text
      adaptedText = content.slice(0, limits.caption.max - 3) + '...'
    } else if (stats.charCount > limits.caption.max * 0.9) {
      warnings.push(`Текст близок к лимиту (${stats.charCount}/${limits.caption.max})`)
    }

    if (stats.charCount < limits.caption.min && limits.caption.min > 0) {
      errors.push(`Текст слишком короткий (мин. ${limits.caption.min} символов)`)
    }

    // Check hashtags
    if (stats.hashtagCount > limits.hashtags.max) {
      warnings.push(`Слишком много хэштегов (${stats.hashtagCount}/${limits.hashtags.max})`)
    }

    // Check mentions
    if (stats.mentionCount > limits.mentions.max) {
      warnings.push(`Слишком много упоминаний (${stats.mentionCount}/${limits.mentions.max})`)
    }

    // Check links
    if (!limits.links.allowed && stats.linkCount > 0) {
      errors.push('Ссылки не разрешены на этой платформе')
    } else if (stats.linkCount > limits.links.max) {
      warnings.push(`Слишком много ссылок (${stats.linkCount}/${limits.links.max})`)
    }

    // Check media
    if (limits.media.required && mediaCount === 0) {
      errors.push('Требуется медиафайл')
    }
    if (mediaCount > limits.media.maxCount) {
      warnings.push(`Слишком много медиафайлов (${mediaCount}/${limits.media.maxCount})`)
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
      adaptedText,
      stats: extractStats(adaptedText),
    }
  }

  const validations = useMemo(() => {
    const results: Record<string, ValidationResult> = {}
    platforms.forEach(p => {
      results[p] = validateForPlatform(text, p)
    })
    return results
  }, [text, platforms, mediaCount])

  const currentValidation = validations[activePlatform]
  const currentLimits = PLATFORM_LIMITS[activePlatform]

  return (
    <div className="space-y-4">
      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2">
        {platforms.map(platformId => {
          const platform = PLATFORM_LIMITS[platformId]
          if (!platform) return null

          const validation = validations[platformId]
          const Icon = platform.icon
          const hasErrors = !validation.valid
          const hasWarnings = validation.warnings.length > 0

          return (
            <button
              key={platformId}
              onClick={() => setActivePlatform(platformId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                activePlatform === platformId
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" style={{ color: platform.color }} />
              <span className="text-sm">{platform.name}</span>
              {hasErrors ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : hasWarnings ? (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              ) : (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Preview panel */}
      {currentLimits && currentValidation && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Stats */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <currentLimits.icon className="w-4 h-4" style={{ color: currentLimits.color }} />
              Статистика для {currentLimits.name}
            </h4>

            {/* Character count */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Символы</span>
                <span className={
                  currentValidation.stats.charCount > currentLimits.caption.max
                    ? 'text-red-400'
                    : currentValidation.stats.charCount > currentLimits.caption.max * 0.9
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }>
                  {currentValidation.stats.charCount} / {currentLimits.caption.max}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentValidation.stats.charCount > currentLimits.caption.max
                      ? 'bg-red-500'
                      : currentValidation.stats.charCount > currentLimits.caption.max * 0.9
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (currentValidation.stats.charCount / currentLimits.caption.max) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Other stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <Hash className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                <div className="text-sm font-medium">
                  {currentValidation.stats.hashtagCount}/{currentLimits.hashtags.max}
                </div>
                <div className="text-xs text-gray-500">Хэштеги</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <AtSign className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <div className="text-sm font-medium">
                  {currentValidation.stats.mentionCount}/{currentLimits.mentions.max}
                </div>
                <div className="text-xs text-gray-500">Упоминания</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <LinkIcon className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                <div className="text-sm font-medium">
                  {currentValidation.stats.linkCount}/{currentLimits.links.max}
                </div>
                <div className="text-xs text-gray-500">Ссылки</div>
              </div>
            </div>

            {/* Media info */}
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Медиа:</span>
              <span className={mediaCount > 0 ? 'text-green-400' : currentLimits.media.required ? 'text-red-400' : 'text-gray-400'}>
                {mediaCount} / {currentLimits.media.maxCount}
                {currentLimits.media.required && ' (обязательно)'}
              </span>
            </div>
          </div>

          {/* Warnings and errors */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-medium">Проверка контента</h4>

            {currentValidation.errors.length === 0 && currentValidation.warnings.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>Контент соответствует требованиям</span>
              </div>
            ) : (
              <>
                {currentValidation.errors.map((error, i) => (
                  <div key={`e-${i}`} className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-300">{error}</span>
                  </div>
                ))}
                {currentValidation.warnings.map((warning, i) => (
                  <div key={`w-${i}`} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-yellow-300">{warning}</span>
                  </div>
                ))}
              </>
            )}

            {/* Truncation notice */}
            {currentValidation.adaptedText !== text && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Scissors className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm text-indigo-300">Текст будет обрезан</span>
                  {onTextChange && (
                    <button
                      onClick={() => onTextChange(currentValidation.adaptedText)}
                      className="block text-xs text-indigo-400 hover:underline mt-1"
                    >
                      Применить обрезанную версию
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Adapted text preview */}
      {currentValidation && currentValidation.adaptedText !== text && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-indigo-400" />
            Адаптированный текст для {currentLimits?.name}
          </h4>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">
            {currentValidation.adaptedText}
          </p>
        </div>
      )}
    </div>
  )
}
