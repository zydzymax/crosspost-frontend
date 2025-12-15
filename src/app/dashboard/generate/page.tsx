'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles, Film, Image as ImageIcon, Download,
  Loader2, Check, AlertCircle, Clock, RefreshCw,
  Wand2, Video, Settings
} from 'lucide-react'

interface ImageTask {
  id: string
  prompt: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  image_url?: string
  provider: string
  created_at: string
}

interface VideoTask {
  id: string
  prompt: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  duration_seconds: number
  cost_estimate: number
  error?: string
  created_at: string
}

const imageProviders = [
  { id: 'openai', name: 'DALL-E 3', quality: 'Высокое', cost: '$0.12' },
  { id: 'midjourney', name: 'Midjourney', quality: 'Премиум', cost: '$0.24' },
  { id: 'nanobana', name: 'Nanobana', quality: 'Базовое', cost: '$0.03' },
]

const aspectRatios = [
  { id: '1:1', name: 'Квадрат', icon: '⬜' },
  { id: '16:9', name: 'Горизонт', icon: '▬' },
  { id: '9:16', name: 'Вертикаль', icon: '▮' },
]

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image')

  // Image generation
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageProvider, setImageProvider] = useState('openai')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imageHistory, setImageHistory] = useState<ImageTask[]>([])

  // Video generation
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoDuration, setVideoDuration] = useState(5)
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9')
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [videoHistory, setVideoHistory] = useState<VideoTask[]>([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch video tasks
      const videoRes = await fetch('/api/v1/video-gen/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (videoRes.ok) {
        setVideoHistory(await videoRes.json())
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const generateImage = async () => {
    if (!imagePrompt.trim()) return

    setGeneratingImage(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/images/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          provider: imageProvider,
          aspect_ratio: aspectRatio,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.image_url) {
          setImageHistory(prev => [{
            id: Date.now().toString(),
            prompt: imagePrompt,
            status: 'completed',
            image_url: data.image_url,
            provider: imageProvider,
            created_at: new Date().toISOString(),
          }, ...prev])
          setImagePrompt('')
        }
      }
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setGeneratingImage(false)
    }
  }

  const generateVideo = async () => {
    if (!videoPrompt.trim()) return

    setGeneratingVideo(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/video-gen/text-to-video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: videoDuration,
          aspect_ratio: videoAspectRatio,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setVideoHistory(prev => [data, ...prev])
        setVideoPrompt('')
      }
    } catch (err) {
      console.error('Video generation failed:', err)
    } finally {
      setGeneratingVideo(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Генерация</h1>
        <p className="text-gray-400">
          Создавайте изображения и видео с помощью искусственного интеллекта
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            activeTab === 'image'
              ? 'bg-indigo-500'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Изображения
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            activeTab === 'video'
              ? 'bg-purple-500'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <Film className="w-5 h-5" />
          Видео
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generation form */}
        <div className="space-y-6">
          {activeTab === 'image' ? (
            <>
              {/* Image generation form */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-indigo-400" />
                  Генерация изображения
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Описание</label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Опишите, что должно быть на изображении..."
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Провайдер</label>
                    <div className="grid grid-cols-3 gap-2">
                      {imageProviders.map(provider => (
                        <button
                          key={provider.id}
                          onClick={() => setImageProvider(provider.id)}
                          className={`p-3 rounded-lg border text-center transition ${
                            imageProvider === provider.id
                              ? 'bg-white/10 border-indigo-500'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-medium text-sm">{provider.name}</div>
                          <div className="text-xs text-gray-400">{provider.quality}</div>
                          <div className="text-xs text-indigo-400">{provider.cost}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Формат</label>
                    <div className="flex gap-2">
                      {aspectRatios.map(ratio => (
                        <button
                          key={ratio.id}
                          onClick={() => setAspectRatio(ratio.id)}
                          className={`flex-1 p-3 rounded-lg border text-center transition ${
                            aspectRatio === ratio.id
                              ? 'bg-white/10 border-indigo-500'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="text-2xl mb-1">{ratio.icon}</div>
                          <div className="text-xs">{ratio.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={generateImage}
                    disabled={generatingImage || !imagePrompt.trim()}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Сгенерировать
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Video generation form */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  Генерация видео (Runway ML)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Описание видео</label>
                    <textarea
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Опишите, что должно происходить в видео..."
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Длительность</label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
                      >
                        <option value={5}>5 секунд (~$0.75)</option>
                        <option value={10}>10 секунд (~$1.50)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Формат</label>
                      <select
                        value={videoAspectRatio}
                        onChange={(e) => setVideoAspectRatio(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
                      >
                        <option value="16:9">16:9 (YouTube)</option>
                        <option value="9:16">9:16 (Reels/TikTok)</option>
                        <option value="1:1">1:1 (Instagram)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300">Время генерации: ~2-3 минуты</span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Стоимость: $0.15 за секунду видео
                    </p>
                  </div>

                  <button
                    onClick={generateVideo}
                    disabled={generatingVideo || !videoPrompt.trim()}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generatingVideo ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Film className="w-5 h-5" />
                        Сгенерировать видео
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* History */}
        <div>
          <h3 className="font-semibold mb-4">История генераций</h3>

          {activeTab === 'image' ? (
            <div className="grid grid-cols-2 gap-3">
              {imageHistory.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  Нет сгенерированных изображений
                </div>
              ) : (
                imageHistory.map(task => (
                  <div
                    key={task.id}
                    className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                  >
                    {task.image_url ? (
                      <div className="relative aspect-square">
                        <img
                          src={task.image_url}
                          alt={task.prompt}
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={task.image_url}
                          download
                          className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-white/5">
                        {task.status === 'generating' ? (
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-red-400" />
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm text-gray-300 line-clamp-2">{task.prompt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{task.provider}</span>
                        {task.status === 'completed' && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {videoHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Нет сгенерированных видео
                </div>
              ) : (
                videoHistory.map(task => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                        {task.thumbnail_url ? (
                          <img
                            src={task.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : task.status === 'generating' ? (
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        ) : task.status === 'failed' ? (
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <Video className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 line-clamp-2">{task.prompt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{task.duration_seconds}сек</span>
                          <span>${task.cost_estimate?.toFixed(2)}</span>
                          <span className={
                            task.status === 'completed' ? 'text-green-400' :
                            task.status === 'failed' ? 'text-red-400' :
                            task.status === 'generating' ? 'text-yellow-400' :
                            ''
                          }>
                            {task.status === 'completed' ? 'Готово' :
                             task.status === 'failed' ? 'Ошибка' :
                             task.status === 'generating' ? 'Генерация...' : 'Ожидание'}
                          </span>
                        </div>
                      </div>
                      {task.video_url && (
                        <a
                          href={task.video_url}
                          download
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    {task.error && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/10 text-xs text-red-400">
                        {task.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <button
            onClick={fetchHistory}
            className="mt-4 w-full py-2 border border-white/10 rounded-lg hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm text-gray-400"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
        </div>
      </div>
    </div>
  )
}
