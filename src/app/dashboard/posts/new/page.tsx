'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Send, Clock, Calendar, Image as ImageIcon,
  Sparkles, Film, X, Upload, Loader2, Check,
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, AlertTriangle
} from 'lucide-react'
import ContentPreview from '@/components/posts/ContentPreview'

const platforms = [
  { id: 'telegram', name: 'Telegram', icon: MessageSquare, color: '#0088cc' },
  { id: 'vk', name: 'VKontakte', icon: Users, color: '#4a76a8' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: '#000000' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'rutube', name: 'RuTube', icon: Video, color: '#00A8E6' },
]

export default function NewPostPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['telegram'])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  // AI Generation
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatingText, setGeneratingText] = useState(false)

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 10 files
    const newFiles = files.slice(0, 10 - mediaFiles.length)
    setMediaFiles(prev => [...prev, ...newFiles])

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const generateImage = async () => {
    if (!aiPrompt.trim()) return

    setGeneratingImage(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/images/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      const data = await res.json()
      if (data.image_url) {
        // Add to previews
        setMediaPreviews(prev => [...prev, data.image_url])
        // Create a placeholder for the file
        setMediaFiles(prev => [...prev, new File([], 'ai-generated.png')])
      }
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleSubmit = async (publish: boolean = false) => {
    if (!text.trim() && mediaFiles.length === 0) {
      setError('Добавьте текст или медиафайлы')
      return
    }

    if (selectedPlatforms.length === 0) {
      setError('Выберите хотя бы одну платформу')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')

      // Prepare form data
      const formData = new FormData()
      formData.append('text', text)
      formData.append('platforms', JSON.stringify(selectedPlatforms))

      if (isScheduled && scheduleDate && scheduleTime) {
        const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`)
        formData.append('scheduled_at', scheduledAt.toISOString())
      }

      if (publish) {
        formData.append('publish_now', 'true')
      }

      mediaFiles.forEach((file, i) => {
        if (file.size > 0) {
          formData.append('media', file)
        }
      })

      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        router.push('/dashboard/posts')
      } else {
        const data = await res.json()
        setError(data.detail || 'Не удалось создать пост')
      }
    } catch (err) {
      setError('Ошибка при создании поста')
    } finally {
      setSubmitting(false)
    }
  }

  // Get minimum date for scheduler (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к постам
      </Link>

      <h1 className="text-2xl font-bold mb-6">Новый пост</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text input */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <label className="block text-sm text-gray-400 mb-2">Текст поста</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите текст вашего поста..."
              className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-400">{text.length} символов</span>
              <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition text-sm"
              >
                <Sparkles className="w-4 h-4" />
                AI помощник
              </button>
            </div>
          </div>

          {/* AI Panel */}
          {showAiPanel && (
            <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI генерация
              </h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Опишите, что нужно сгенерировать..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={generateImage}
                    disabled={generatingImage || !aiPrompt}
                    className="flex-1 py-2 bg-purple-500 rounded-lg font-medium hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generatingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    Сгенерировать картинку
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media upload */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <label className="block text-sm text-gray-400 mb-3">Медиафайлы</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="grid grid-cols-3 gap-3">
              {mediaPreviews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {mediaFiles.length < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 transition flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-400">Загрузить</span>
                </button>
              )}
            </div>
          </div>

          {/* Content preview */}
          {selectedPlatforms.length > 0 && text.length > 0 && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-4">Превью по платформам</h3>
              <ContentPreview
                text={text}
                platforms={selectedPlatforms}
                mediaCount={mediaFiles.length}
                onTextChange={setText}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform selection */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4">Платформы</h3>
            <div className="space-y-2">
              {platforms.map(platform => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                      isSelected
                        ? 'bg-white/10 border-indigo-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: platform.color + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: platform.color }} />
                    </div>
                    <span className="flex-1 text-left">{platform.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scheduling */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Планирование
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Запланировать публикацию</span>
              </label>

              {isScheduled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Дата</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={today}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Время</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  {scheduleDate && scheduleTime && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                      <Calendar className="w-4 h-4 inline mr-2 text-blue-400" />
                      {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isScheduled ? (
                <>
                  <Clock className="w-5 h-5" />
                  Запланировать
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Опубликовать сейчас
                </>
              )}
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="w-full py-3 bg-white/10 border border-white/10 rounded-xl font-medium hover:bg-white/20 transition disabled:opacity-50"
            >
              Сохранить как черновик
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
