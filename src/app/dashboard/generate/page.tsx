'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles, Film, Image as ImageIcon, Download,
  Loader2, Check, AlertCircle, Clock, RefreshCw,
  Wand2, Video, Settings, Mic, Play, Volume2, Star,
  Zap, Crown, Coins
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

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
  provider: string
  error?: string
  created_at: string
}

interface TTSTask {
  id: string
  text: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  audio_url?: string
  provider: string
  voice: string
  created_at: string
}

// =============================================================================
// PROVIDERS DATA
// =============================================================================

const imageProviders = [
  {
    id: 'nanobana',
    name: 'Nano Banana Flash',
    quality: 'standard',
    credits: 1,
    description: 'Быстрая генерация',
    strengths: ['Скорость', 'Низкая цена', 'Большие объёмы'],
    bestFor: 'Тесты идей, массовая генерация',
    badge: 'Экономный'
  },
  {
    id: 'openai',
    name: 'DALL-E 3',
    quality: 'high',
    credits: 2,
    description: 'Реалистичные изображения',
    strengths: ['Фотореализм', 'Текст на картинках', 'Сложные сцены'],
    bestFor: 'Продуктовые фото, реклама',
    badge: null
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    quality: 'premium',
    credits: 4,
    description: 'Художественное качество',
    strengths: ['Арт-стиль', 'Эстетика', 'Маркетинг'],
    bestFor: 'Арт, иллюстрации, креатив',
    badge: 'Премиум'
  },
  {
    id: 'nanobana-pro',
    name: 'Nano Banana Pro',
    quality: 'premium',
    credits: 6,
    description: 'Google Gemini 3 Pro',
    strengths: ['4K разрешение', 'Детализация', 'Сложные промпты'],
    bestFor: 'Печать, баннеры, премиум',
    badge: '4K'
  },
]

const videoProviders = [
  {
    id: 'minimax',
    name: 'MiniMax Hailuo',
    quality: 'high',
    credits: 1,
    description: 'Отличное соотношение цена/качество',
    strengths: ['Реалистичные движения', 'Персонажи', 'Доступная цена'],
    bestFor: 'Соцсети, анимация',
    duration: 6,
    badge: 'Рекомендуем'
  },
  {
    id: 'kling',
    name: 'Kling AI',
    quality: 'high',
    credits: 1,
    description: 'Image-to-video специалист',
    strengths: ['Image-to-video', 'Быстро', 'Низкая цена'],
    bestFor: 'Анимация изображений, Reels',
    duration: 5,
    badge: null
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    quality: 'premium',
    credits: 3,
    description: 'Лучшее качество видео',
    strengths: ['Премиум качество', 'Контроль движения', 'Кино'],
    bestFor: 'Реклама, премиум контент',
    duration: 5,
    badge: 'Премиум'
  },
]

const ttsProviders = [
  {
    id: 'openai-tts',
    name: 'OpenAI TTS',
    quality: 'high',
    credits: 1,
    description: 'Естественная речь',
    strengths: ['Натуральность', '6 голосов', 'Быстро'],
    bestFor: 'Озвучка постов, сторис',
    badge: null
  },
  {
    id: 'openai-tts-hd',
    name: 'OpenAI TTS HD',
    quality: 'premium',
    credits: 2,
    description: 'HD качество звука',
    strengths: ['HD качество', 'Подкасты', 'Профессионально'],
    bestFor: 'Подкасты, профессиональная озвучка',
    badge: 'HD'
  },
]

const voices = [
  { id: 'alloy', name: 'Alloy', gender: 'Нейтральный' },
  { id: 'echo', name: 'Echo', gender: 'Мужской' },
  { id: 'fable', name: 'Fable', gender: 'Британский' },
  { id: 'onyx', name: 'Onyx', gender: 'Глубокий мужской' },
  { id: 'nova', name: 'Nova', gender: 'Женский' },
  { id: 'shimmer', name: 'Shimmer', gender: 'Тёплый женский' },
]

const aspectRatios = [
  { id: '1:1', name: 'Квадрат', icon: '⬜' },
  { id: '16:9', name: 'YouTube', icon: '▬' },
  { id: '9:16', name: 'Reels/TikTok', icon: '▮' },
]

// =============================================================================
// PROVIDER CARD COMPONENT
// =============================================================================

function ProviderCard({
  provider,
  selected,
  onSelect,
  type
}: {
  provider: any
  selected: boolean
  onSelect: () => void
  type: 'image' | 'video' | 'tts'
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative p-4 rounded-xl border-2 transition-all text-left w-full ${
        selected
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      {/* Badge */}
      {provider.badge && (
        <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full ${
          provider.badge === 'Премиум' ? 'bg-purple-500' :
          provider.badge === 'Рекомендуем' ? 'bg-green-500' :
          provider.badge === '4K' ? 'bg-blue-500' :
          provider.badge === 'HD' ? 'bg-cyan-500' :
          'bg-yellow-500'
        }`}>
          {provider.badge}
        </span>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-white">{provider.name}</h4>
          <p className="text-xs text-gray-400">{provider.description}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Coins className="w-4 h-4" />
          <span className="text-sm font-medium">{provider.credits}</span>
        </div>
      </div>
      
      {/* Strengths */}
      <div className="flex flex-wrap gap-1 mt-2">
        {provider.strengths.slice(0, 3).map((strength: string, i: number) => (
          <span key={i} className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-300">
            {strength}
          </span>
        ))}
      </div>
      
      {/* Best for */}
      <p className="text-xs text-gray-500 mt-2">
        <span className="text-gray-400">Лучше для:</span> {provider.bestFor}
      </p>
      
      {/* Quality indicator */}
      <div className="flex items-center gap-1 mt-2">
        {[...Array(provider.quality === 'premium' ? 3 : provider.quality === 'high' ? 2 : 1)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {[...Array(3 - (provider.quality === 'premium' ? 3 : provider.quality === 'high' ? 2 : 1))].map((_, i) => (
          <Star key={i} className="w-3 h-3 text-gray-600" />
        ))}
      </div>
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 left-2">
          <Check className="w-5 h-5 text-indigo-400" />
        </div>
      )}
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'tts'>('image')

  // Image generation
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageProvider, setImageProvider] = useState('nanobana')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imageHistory, setImageHistory] = useState<ImageTask[]>([])

  // Video generation
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoProvider, setVideoProvider] = useState('minimax')
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9')
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [videoHistory, setVideoHistory] = useState<VideoTask[]>([])

  // TTS generation
  const [ttsText, setTtsText] = useState('')
  const [ttsProvider, setTtsProvider] = useState('openai-tts')
  const [ttsVoice, setTtsVoice] = useState('nova')
  const [generatingTts, setGeneratingTts] = useState(false)
  const [ttsHistory, setTtsHistory] = useState<TTSTask[]>([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
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
        setImageHistory(prev => [data, ...prev])
        setImagePrompt('')
      }
    } catch (err) {
      console.error('Image generation failed:', err)
    }
    setGeneratingImage(false)
  }

  const generateVideo = async () => {
    if (!videoPrompt.trim()) return
    setGeneratingVideo(true)
    try {
      const token = localStorage.getItem('token')
      const provider = videoProviders.find(p => p.id === videoProvider)
      const res = await fetch('/api/v1/video-gen/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          provider: videoProvider,
          duration_seconds: provider?.duration || 5,
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
    }
    setGeneratingVideo(false)
  }

  const generateTts = async () => {
    if (!ttsText.trim()) return
    setGeneratingTts(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/tts/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: ttsText,
          provider: ttsProvider,
          voice: ttsVoice,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setTtsHistory(prev => [data, ...prev])
        setTtsText('')
      }
    } catch (err) {
      console.error('TTS generation failed:', err)
    }
    setGeneratingTts(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="text-indigo-400" />
            AI Генерация
          </h1>
          <p className="text-gray-400 mt-2">
            Создавайте контент с помощью нейросетей. Выберите провайдера под ваши задачи.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'image', icon: ImageIcon, label: 'Изображения' },
            { id: 'video', icon: Video, label: 'Видео' },
            { id: 'tts', icon: Mic, label: 'Озвучка' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Generation Form */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            {/* IMAGE TAB */}
            {activeTab === 'image' && (
              <>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  Генерация изображений
                </h3>

                {/* Provider Selection */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Выберите нейросеть</label>
                  <div className="grid grid-cols-2 gap-3">
                    {imageProviders.map(provider => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        selected={imageProvider === provider.id}
                        onSelect={() => setImageProvider(provider.id)}
                        type="image"
                      />
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Формат</label>
                  <div className="flex gap-2">
                    {aspectRatios.map(ar => (
                      <button
                        key={ar.id}
                        onClick={() => setAspectRatio(ar.id)}
                        className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                          aspectRatio === ar.id
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-lg">{ar.icon}</span>
                        <span className="text-xs block mt-1 text-gray-400">{ar.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Описание</label>
                  <textarea
                    value={imagePrompt}
                    onChange={e => setImagePrompt(e.target.value)}
                    placeholder="Опишите изображение..."
                    className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={generateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {generatingImage ? 'Генерация...' : 'Сгенерировать'}
                </button>
              </>
            )}

            {/* VIDEO TAB */}
            {activeTab === 'video' && (
              <>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-400" />
                  Генерация видео
                </h3>

                {/* Provider Selection */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Выберите нейросеть</label>
                  <div className="grid grid-cols-1 gap-3">
                    {videoProviders.map(provider => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        selected={videoProvider === provider.id}
                        onSelect={() => setVideoProvider(provider.id)}
                        type="video"
                      />
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Формат видео</label>
                  <div className="flex gap-2">
                    {aspectRatios.map(ar => (
                      <button
                        key={ar.id}
                        onClick={() => setVideoAspectRatio(ar.id)}
                        className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                          videoAspectRatio === ar.id
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-lg">{ar.icon}</span>
                        <span className="text-xs block mt-1 text-gray-400">{ar.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Описание сцены</label>
                  <textarea
                    value={videoPrompt}
                    onChange={e => setVideoPrompt(e.target.value)}
                    placeholder="Опишите что должно происходить в видео..."
                    className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={generateVideo}
                  disabled={generatingVideo || !videoPrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
                  {generatingVideo ? 'Генерация...' : 'Создать видео'}
                </button>
              </>
            )}

            {/* TTS TAB */}
            {activeTab === 'tts' && (
              <>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-400" />
                  Озвучка текста
                </h3>

                {/* Provider Selection */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Качество</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ttsProviders.map(provider => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        selected={ttsProvider === provider.id}
                        onSelect={() => setTtsProvider(provider.id)}
                        type="tts"
                      />
                    ))}
                  </div>
                </div>

                {/* Voice Selection */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Голос</label>
                  <div className="grid grid-cols-3 gap-2">
                    {voices.map(voice => (
                      <button
                        key={voice.id}
                        onClick={() => setTtsVoice(voice.id)}
                        className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                          ttsVoice === voice.id
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-xs text-gray-400">{voice.gender}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Текст для озвучки
                    <span className="text-gray-500 ml-2">({ttsText.length}/4000)</span>
                  </label>
                  <textarea
                    value={ttsText}
                    onChange={e => setTtsText(e.target.value.slice(0, 4000))}
                    placeholder="Введите текст для озвучивания..."
                    className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={generateTts}
                  disabled={generatingTts || !ttsText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingTts ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                  {generatingTts ? 'Озвучивание...' : 'Озвучить'}
                </button>
              </>
            )}
          </div>

          {/* Right - History */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              История генераций
            </h3>

            {activeTab === 'image' && (
              <div className="space-y-3">
                {imageHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Пока нет сгенерированных изображений</p>
                ) : (
                  imageHistory.map(task => (
                    <div key={task.id} className="bg-white/5 rounded-lg p-3">
                      {task.status === 'completed' && task.image_url ? (
                        <img src={task.image_url} alt={task.prompt} className="w-full rounded-lg mb-2" />
                      ) : (
                        <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center">
                          {task.status === 'generating' && <Loader2 className="w-6 h-6 animate-spin" />}
                          {task.status === 'failed' && <AlertCircle className="w-6 h-6 text-red-400" />}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 truncate">{task.prompt}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-3">
                {videoHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Пока нет сгенерированных видео</p>
                ) : (
                  videoHistory.map(task => (
                    <div key={task.id} className="bg-white/5 rounded-lg p-3">
                      {task.status === 'completed' && task.video_url ? (
                        <video src={task.video_url} controls className="w-full rounded-lg mb-2" />
                      ) : (
                        <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center">
                          {task.status === 'generating' && (
                            <div className="text-center">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                              <span className="text-xs text-gray-400">Генерация видео...</span>
                            </div>
                          )}
                          {task.status === 'failed' && <AlertCircle className="w-6 h-6 text-red-400" />}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 truncate">{task.prompt}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'tts' && (
              <div className="space-y-3">
                {ttsHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Пока нет озвученных текстов</p>
                ) : (
                  ttsHistory.map(task => (
                    <div key={task.id} className="bg-white/5 rounded-lg p-3">
                      {task.status === 'completed' && task.audio_url ? (
                        <audio src={task.audio_url} controls className="w-full mb-2" />
                      ) : (
                        <div className="w-full h-16 bg-white/5 rounded-lg flex items-center justify-center">
                          {task.status === 'generating' && <Loader2 className="w-6 h-6 animate-spin" />}
                          {task.status === 'failed' && <AlertCircle className="w-6 h-6 text-red-400" />}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 truncate">{task.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
