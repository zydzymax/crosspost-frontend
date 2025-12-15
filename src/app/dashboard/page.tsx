'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Send, Calendar, BarChart3, Settings, Bell, LogOut,
  MessageSquare, Instagram, Youtube, Music2,
  Plus, Clock, CheckCircle2, AlertCircle, Sparkles,
  Image as ImageIcon, Hash, Loader2
} from 'lucide-react'

interface User {
  id: string
  telegram_id: number
  telegram_username?: string
  first_name?: string
  last_name?: string
  photo_url?: string
  subscription_plan: string
  demo_days_left?: number
  image_gen_provider: string
}

interface Stats {
  posts_count_this_month: number
  images_generated_this_month: number
  subscription_plan: string
  demo_days_left?: number
  accounts_count: number
  topics_count: number
}

interface Account {
  id: string
  platform: string
  username?: string
  display_name?: string
  is_active: boolean
  can_publish: boolean
}

interface Topic {
  id: string
  name: string
  color: string
  is_active: boolean
}

const platformIcons: Record<string, any> = {
  telegram: MessageSquare,
  vk: MessageSquare,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
}

const platformColors: Record<string, string> = {
  telegram: '#0088cc',
  vk: '#4a76a8',
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  // New topic state
  const [newTopicName, setNewTopicName] = useState('')
  const [addingTopic, setAddingTopic] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Fetch data
    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      const [statsRes, accountsRes, topicsRes] = await Promise.all([
        fetch('/api/v1/user/stats', { headers }),
        fetch('/api/v1/user/accounts', { headers }),
        fetch('/api/v1/user/topics', { headers }),
      ])
      
      if (statsRes.ok) setStats(await statsRes.json())
      if (accountsRes.ok) setAccounts(await accountsRes.json())
      if (topicsRes.ok) setTopics(await topicsRes.json())
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const generateImage = async () => {
    if (!imagePrompt.trim()) return
    
    setGeneratingImage(true)
    setGeneratedImage(null)
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/images/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      })
      
      const data = await res.json()
      if (data.success && data.image_url) {
        setGeneratedImage(data.image_url)
      } else if (data.image_base64) {
        setGeneratedImage(`data:image/png;base64,${data.image_base64}`)
      }
    } catch (err) {
      console.error('Image generation failed:', err)
    } finally {
      setGeneratingImage(false)
    }
  }

  const addTopic = async () => {
    if (!newTopicName.trim()) return
    
    setAddingTopic(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/topics', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTopicName }),
      })
      
      if (res.ok) {
        const newTopic = await res.json()
        setTopics([newTopic, ...topics])
        setNewTopicName('')
      }
    } catch (err) {
      console.error('Failed to add topic:', err)
    } finally {
      setAddingTopic(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Crosspost</h1>
            <p className="text-xs text-gray-400">by Sales Whisper</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Дашборд' },
            { id: 'posts', icon: Plus, label: 'Создать пост' },
            { id: 'accounts', icon: Settings, label: 'Аккаунты' },
            { id: 'topics', icon: Hash, label: 'Темы' },
            { id: 'images', icon: ImageIcon, label: 'Генерация' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Demo warning */}
        {stats?.demo_days_left !== undefined && stats.demo_days_left <= 7 && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Demo</span>
            </div>
            <p className="text-xs text-gray-400">
              {stats.demo_days_left > 0
                ? `Осталось ${stats.demo_days_left} дней`
                : 'Демо период истёк'}
            </p>
          </div>
        )}

        {/* User */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-400 font-medium">
                  {user?.first_name?.[0] || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.first_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">@{user?.telegram_username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Добро пожаловать, {user?.first_name}!</h2>
              <p className="text-gray-400">Управляйте контентом во всех соцсетях</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Постов', value: stats?.posts_count_this_month || 0 },
                { label: 'Аккаунтов', value: stats?.accounts_count || 0 },
                { label: 'Тем', value: stats?.topics_count || 0 },
                { label: 'Картинок', value: stats?.images_generated_this_month || 0 },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Connected Accounts */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Подключенные аккаунты</h3>
                <div className="space-y-3">
                  {accounts.length > 0 ? (
                    accounts.map((account) => {
                      const Icon = platformIcons[account.platform] || MessageSquare
                      const color = platformColors[account.platform] || '#666'
                      return (
                        <div
                          key={account.id}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: color + '20' }}
                            >
                              <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div>
                              <p className="font-medium">{account.username || account.platform}</p>
                              <p className="text-xs text-gray-400 capitalize">{account.platform}</p>
                            </div>
                          </div>
                          {account.is_active ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-8 rounded-xl bg-white/5 border border-white/10 border-dashed text-center">
                      <p className="text-gray-400 mb-2">Нет подключенных аккаунтов</p>
                      <button
                        onClick={() => setActiveTab('accounts')}
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Подключить первый аккаунт
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Темы контента</h3>
                <div className="space-y-3">
                  {topics.length > 0 ? (
                    topics.slice(0, 5).map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: topic.color }}
                        />
                        <span>{topic.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-xl bg-white/5 border border-white/10 border-dashed text-center">
                      <p className="text-gray-400 mb-2">Нет созданных тем</p>
                      <button
                        onClick={() => setActiveTab('topics')}
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Создать первую тему
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'images' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Генерация картинок</h2>
              <p className="text-gray-400">AI создаст картинку по вашему описанию</p>
            </div>

            <div className="max-w-2xl">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-6">
                <label className="block text-sm font-medium mb-2">Описание картинки</label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Опишите, что должно быть на картинке..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  onClick={generateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

              {generatedImage && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'topics' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Темы контента</h2>
              <p className="text-gray-400">Организуйте посты по темам</p>
            </div>

            <div className="max-w-2xl">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex gap-4">
                <input
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Название новой темы..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={addTopic}
                  disabled={addingTopic || !newTopicName.trim()}
                  className="px-6 py-2 bg-indigo-500 rounded-lg font-medium disabled:opacity-50"
                >
                  {addingTopic ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Добавить'}
                </button>
              </div>

              <div className="space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: topic.color }}
                      />
                      <span className="font-medium">{topic.name}</span>
                    </div>
                    {topic.is_active ? (
                      <span className="text-xs text-green-400">Активна</span>
                    ) : (
                      <span className="text-xs text-gray-400">Неактивна</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'accounts' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Подключенные аккаунты</h2>
              <p className="text-gray-400">Управляйте аккаунтами для кросспостинга</p>
            </div>

            <div className="max-w-2xl">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 border-dashed text-center">
                <p className="text-gray-400 mb-4">Подключение аккаунтов через API токены</p>
                <p className="text-sm text-gray-500">
                  Для подключения аккаунта обратитесь в поддержку или используйте API
                </p>
              </div>

              {accounts.length > 0 && (
                <div className="mt-6 space-y-3">
                  {accounts.map((account) => {
                    const Icon = platformIcons[account.platform] || MessageSquare
                    const color = platformColors[account.platform] || '#666'
                    return (
                      <div
                        key={account.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: color + '20' }}
                          >
                            <Icon className="w-5 h-5" style={{ color }} />
                          </div>
                          <div>
                            <p className="font-medium">{account.username || account.display_name || account.platform}</p>
                            <p className="text-xs text-gray-400 capitalize">{account.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.is_active ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'posts' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Создать пост</h2>
              <p className="text-gray-400">Опубликуйте контент во все соцсети одним кликом</p>
            </div>

            <div className="max-w-2xl">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <textarea
                  placeholder="Напишите текст поста..."
                  className="w-full h-40 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none mb-4"
                />
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-400">Платформы:</span>
                  {Object.entries(platformIcons).map(([platform, Icon]) => (
                    <button
                      key={platform}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-indigo-500 transition"
                    >
                      <Icon className="w-5 h-5" style={{ color: platformColors[platform] }} />
                    </button>
                  ))}
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Опубликовать
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
