'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquare, Users, Instagram, Youtube, Music2,
  Facebook, Video, Plus, CheckCircle2, AlertCircle,
  ExternalLink, Trash2, RefreshCw, Loader2
} from 'lucide-react'

interface Account {
  id: string
  platform: string
  username?: string
  display_name?: string
  is_active: boolean
  can_publish: boolean
  created_at: string
}

const platforms = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: MessageSquare,
    color: '#0088cc',
    description: 'Публикация в каналы и группы',
  },
  {
    id: 'vk',
    name: 'VKontakte',
    icon: Users,
    color: '#4a76a8',
    description: 'Посты в сообщества и на стену',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    description: 'Посты, Stories, Reels',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    description: 'Посты на страницы',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Music2,
    color: '#000000',
    description: 'Видео контент',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    description: 'Видео и Shorts',
  },
  {
    id: 'rutube',
    name: 'RuTube',
    icon: Video,
    color: '#00A8E6',
    description: 'Российская видеоплатформа',
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/user/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setAccounts(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshAccount = async (accountId: string) => {
    setRefreshing(accountId)
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/v1/user/accounts/${accountId}/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchAccounts()
    } catch (err) {
      console.error('Failed to refresh account:', err)
    } finally {
      setRefreshing(null)
    }
  }

  const getAccountsForPlatform = (platformId: string) => {
    return accounts.filter(a => a.platform === platformId)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Подключенные аккаунты</h1>
        <p className="text-gray-400">
          Подключите социальные сети для автоматического кросспостинга
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => {
            const platformAccounts = getAccountsForPlatform(platform.id)
            const Icon = platform.icon
            const hasAccounts = platformAccounts.length > 0

            return (
              <div
                key={platform.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: platform.color + '20' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                </div>

                {hasAccounts ? (
                  <div className="space-y-2 mb-4">
                    {platformAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          {account.is_active ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="text-sm">
                            {account.username || account.display_name || 'Аккаунт'}
                          </span>
                        </div>
                        <button
                          onClick={() => refreshAccount(account.id)}
                          disabled={refreshing === account.id}
                          className="p-1 hover:bg-white/5 rounded transition"
                        >
                          <RefreshCw className={`w-4 h-4 text-gray-400 ${
                            refreshing === account.id ? 'animate-spin' : ''
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 mb-4">
                    <p className="text-sm text-gray-500">Нет подключенных аккаунтов</p>
                  </div>
                )}

                <Link
                  href={`/dashboard/accounts/connect/${platform.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition"
                >
                  {hasAccounts ? (
                    <>
                      <Plus className="w-4 h-4" />
                      Добавить ещё
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Подключить
                    </>
                  )}
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick tips */}
      <div className="mt-8 p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <h3 className="font-semibold text-indigo-400 mb-2">Подсказка</h3>
        <p className="text-sm text-gray-300">
          Для каждой платформы нужен API токен. Нажмите "Подключить" для получения
          пошаговой инструкции по созданию токена для выбранной социальной сети.
        </p>
      </div>
    </div>
  )
}
