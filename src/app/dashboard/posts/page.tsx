'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus, Calendar, Clock, Send, Edit2, Trash2,
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Filter, Search, MoreVertical,
  CheckCircle2, AlertCircle, Loader2, Eye
} from 'lucide-react'

interface Post {
  id: string
  text: string
  platforms: string[]
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
  scheduled_at?: string
  published_at?: string
  media_count: number
  created_at: string
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

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'text-gray-400' },
  scheduled: { label: 'Запланирован', color: 'text-blue-400' },
  publishing: { label: 'Публикуется', color: 'text-yellow-400' },
  published: { label: 'Опубликован', color: 'text-green-400' },
  failed: { label: 'Ошибка', color: 'text-red-400' },
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/posts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setPosts(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Удалить пост?')) return

    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPosts(posts.filter(p => p.id !== postId))
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.status !== filter) return false
    if (search && !post.text.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length
  const publishedCount = posts.filter(p => p.status === 'published').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Посты</h1>
          <p className="text-gray-400">
            {scheduledCount} запланировано, {publishedCount} опубликовано
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Новый пост
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по тексту..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'scheduled', 'published', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg border transition ${
                filter === status
                  ? 'bg-white/10 border-indigo-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {status === 'all' ? 'Все' : statusLabels[status]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Нет постов</h3>
          <p className="text-gray-400 mb-4">
            {filter !== 'all' ? 'Нет постов с выбранным статусом' : 'Создайте свой первый пост'}
          </p>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
          >
            <Plus className="w-4 h-4" />
            Создать пост
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => {
            const status = statusLabels[post.status]
            return (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
              >
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div className="pt-1">
                    {post.status === 'published' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : post.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : post.status === 'publishing' ? (
                      <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                    ) : post.status === 'scheduled' ? (
                      <Clock className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 line-clamp-2 mb-2">
                      {post.text || 'Без текста'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {/* Status */}
                      <span className={status.color}>{status.label}</span>

                      {/* Scheduled time */}
                      {post.scheduled_at && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.scheduled_at).toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}

                      {/* Platforms */}
                      <div className="flex items-center gap-1">
                        {post.platforms.map(p => {
                          const Icon = platformIcons[p] || MessageSquare
                          const color = platformColors[p] || '#666'
                          return (
                            <div
                              key={p}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: color + '20' }}
                              title={p}
                            >
                              <Icon className="w-3 h-3" style={{ color }} />
                            </div>
                          )
                        })}
                      </div>

                      {/* Media count */}
                      {post.media_count > 0 && (
                        <span className="text-gray-400">
                          {post.media_count} медиа
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {post.status === 'draft' && (
                      <button
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                        title="Опубликовать"
                      >
                        <Send className="w-4 h-4 text-green-400" />
                      </button>
                    )}
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                      title="Редактировать"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming scheduled posts sidebar */}
      {scheduledCount > 0 && (
        <div className="mt-8 p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Ближайшие публикации
          </h3>
          <div className="space-y-3">
            {posts
              .filter(p => p.status === 'scheduled' && p.scheduled_at)
              .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
              .slice(0, 5)
              .map(post => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{post.text}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.scheduled_at!).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {post.platforms.slice(0, 3).map(p => {
                      const Icon = platformIcons[p] || MessageSquare
                      return <Icon key={p} className="w-4 h-4" style={{ color: platformColors[p] }} />
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
