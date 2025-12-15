'use client'

import { useState, useEffect } from 'react'
import {
  Calendar, Sparkles, Clock, Play, Pause, Trash2,
  ChevronLeft, ChevronRight, Plus, Loader2,
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Edit2, RefreshCw, Check
} from 'lucide-react'

interface PlannedPost {
  date: string
  day_of_week: string
  time: string
  topic: string
  caption_draft: string
  hashtags: string[]
  platforms: string[]
  media_type: string
  image_prompt?: string
  call_to_action?: string
}

interface ContentPlan {
  id: string
  niche: string
  duration_days: number
  posts_per_day: number
  tone: string
  platforms: string[]
  status: string
  posts: PlannedPost[]
  total_posts: number
  posts_created: number
  posts_published: number
}

const platformIcons: Record<string, any> = {
  telegram: MessageSquare,
  vk: Users,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  facebook: Facebook,
  rutube: Video,
}

const platformColors: Record<string, string> = {
  telegram: '#0088cc',
  vk: '#4a76a8',
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  facebook: '#1877F2',
  rutube: '#00A8E6',
}

const tones = [
  { id: 'professional', name: 'Профессиональный' },
  { id: 'casual', name: 'Неформальный' },
  { id: 'humorous', name: 'Юмористический' },
  { id: 'educational', name: 'Образовательный' },
  { id: 'inspirational', name: 'Вдохновляющий' },
]

export default function ContentPlanPage() {
  const [plans, setPlans] = useState<ContentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activePlan, setActivePlan] = useState<ContentPlan | null>(null)
  const [currentWeek, setCurrentWeek] = useState(0)

  // Generation form
  const [showForm, setShowForm] = useState(false)
  const [niche, setNiche] = useState('')
  const [durationDays, setDurationDays] = useState(7)
  const [postsPerDay, setPostsPerDay] = useState(1)
  const [tone, setTone] = useState('professional')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['telegram', 'instagram'])

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/content-plan/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPlans(data)
        if (data.length > 0 && !activePlan) {
          setActivePlan(data[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err)
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    if (!niche.trim()) return

    setGenerating(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/content-plan/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche,
          duration_days: durationDays,
          posts_per_day: postsPerDay,
          platforms: selectedPlatforms,
          tone,
        }),
      })

      if (res.ok) {
        const newPlan = await res.json()
        setPlans(prev => [newPlan, ...prev])
        setActivePlan(newPlan)
        setShowForm(false)
        setNiche('')
      }
    } catch (err) {
      console.error('Failed to generate plan:', err)
    } finally {
      setGenerating(false)
    }
  }

  const activatePlan = async (planId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/v1/content-plan/${planId}/activate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        await fetchPlans()
      }
    } catch (err) {
      console.error('Failed to activate plan:', err)
    }
  }

  const deletePlan = async (planId: string) => {
    if (!confirm('Удалить контент-план?')) return

    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/v1/content-plan/${planId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      setPlans(prev => prev.filter(p => p.id !== planId))
      if (activePlan?.id === planId) {
        setActivePlan(plans.find(p => p.id !== planId) || null)
      }
    } catch (err) {
      console.error('Failed to delete plan:', err)
    }
  }

  const getPostsForWeek = (plan: ContentPlan, weekOffset: number) => {
    const startIndex = weekOffset * 7 * plan.posts_per_day
    const endIndex = startIndex + 7 * plan.posts_per_day
    return plan.posts.slice(startIndex, endIndex)
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Контент-план</h1>
          <p className="text-gray-400">
            AI сгенерирует план публикаций под вашу нишу
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Sparkles className="w-5 h-5" />
          Создать план
        </button>
      </div>

      {/* Generation form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Генерация контент-плана
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ниша / тематика</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Например: фитнес, IT, кулинария..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Тон контента</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
              >
                {tones.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Длительность (дней)</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
              >
                <option value={7}>7 дней</option>
                <option value={14}>14 дней</option>
                <option value={30}>30 дней</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Постов в день</label>
              <select
                value={postsPerDay}
                onChange={(e) => setPostsPerDay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition"
              >
                <option value={1}>1 пост</option>
                <option value={2}>2 поста</option>
                <option value={3}>3 поста</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Платформы</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(platformIcons).map(([id, Icon]) => {
                const isSelected = selectedPlatforms.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      isSelected
                        ? 'bg-white/10 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: platformColors[id] }} />
                    <span className="text-sm">{id}</span>
                    {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={generating || !niche.trim()}
            className="w-full py-3 bg-purple-500 rounded-xl font-medium hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Генерация... (это может занять минуту)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Сгенерировать план
              </>
            )}
          </button>
        </div>
      )}

      {/* Plans list */}
      {plans.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Нет контент-планов</h3>
          <p className="text-gray-400 mb-4">
            Создайте первый AI-план для вашей ниши
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Plans sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Ваши планы</h3>
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => {
                  setActivePlan(plan)
                  setCurrentWeek(0)
                }}
                className={`w-full p-4 rounded-xl border text-left transition ${
                  activePlan?.id === plan.id
                    ? 'bg-white/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium mb-1">{plan.niche}</div>
                <div className="text-sm text-gray-400">
                  {plan.duration_days} дней, {plan.total_posts} постов
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    plan.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : plan.status === 'completed'
                      ? 'bg-gray-500/20 text-gray-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {plan.status === 'active' ? 'Активен' : plan.status === 'completed' ? 'Завершен' : 'Черновик'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Plan details */}
          {activePlan && (
            <div className="lg:col-span-3">
              {/* Plan header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{activePlan.niche}</h2>
                  <p className="text-gray-400">
                    {activePlan.total_posts} постов за {activePlan.duration_days} дней
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activePlan.status === 'draft' && (
                    <button
                      onClick={() => activatePlan(activePlan.id)}
                      className="px-4 py-2 bg-green-500 rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Активировать
                    </button>
                  )}
                  <button
                    onClick={() => deletePlan(activePlan.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Week navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                  disabled={currentWeek === 0}
                  className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-medium">Неделя {currentWeek + 1}</span>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  disabled={(currentWeek + 1) * 7 >= activePlan.duration_days}
                  className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Posts grid */}
              <div className="space-y-3">
                {getPostsForWeek(activePlan, currentWeek).map((post, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          {post.date} ({post.day_of_week})
                          <Clock className="w-4 h-4 ml-2" />
                          {post.time}
                        </div>
                        <h4 className="font-medium">{post.topic}</h4>
                      </div>
                      <div className="flex gap-1">
                        {post.platforms.map(p => {
                          const Icon = platformIcons[p] || MessageSquare
                          return (
                            <div
                              key={p}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: (platformColors[p] || '#666') + '20' }}
                            >
                              <Icon className="w-3 h-3" style={{ color: platformColors[p] }} />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {post.caption_draft}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 5).map((tag, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                          #{tag}
                        </span>
                      ))}
                      {post.hashtags.length > 5 && (
                        <span className="text-xs text-gray-500">+{post.hashtags.length - 5}</span>
                      )}
                    </div>

                    {post.image_prompt && (
                      <div className="mt-2 p-2 rounded-lg bg-purple-500/10 text-xs text-purple-300">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Промпт: {post.image_prompt}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
