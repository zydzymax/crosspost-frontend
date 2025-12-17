'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus, Copy, Edit2, Trash2, Search,
  MessageSquare, Instagram, Youtube, Music2,
  FileText, Sparkles, Tag
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  text: string
  platforms: string[]
  hashtags: string[]
  category: string
  uses_count: number
  created_at: string
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

const categories = [
  { id: 'all', name: 'Все', icon: FileText },
  { id: 'promo', name: 'Промо', icon: Tag },
  { id: 'news', name: 'Новости', icon: FileText },
  { id: 'engagement', name: 'Вовлечение', icon: Sparkles },
]

// Demo templates
const demoTemplates: Template[] = [
  {
    id: '1',
    name: 'Анонс нового товара',
    description: 'Шаблон для объявления о новинках',
    text: 'Встречайте новинку!\n\n{название_товара}\n\n{описание}\n\nЦена: {цена}\n\nПодробности по ссылке в био',
    platforms: ['telegram', 'instagram', 'vk'],
    hashtags: ['новинка', 'магазин', 'товары'],
    category: 'promo',
    uses_count: 15,
    created_at: '2024-12-01',
  },
  {
    id: '2',
    name: 'Опрос для подписчиков',
    description: 'Вовлекающий опрос',
    text: 'Вопрос дня!\n\n{вопрос}\n\nОтветьте в комментариях!',
    platforms: ['telegram', 'instagram'],
    hashtags: ['опрос', 'вопрос'],
    category: 'engagement',
    uses_count: 8,
    created_at: '2024-12-05',
  },
  {
    id: '3',
    name: 'Еженедельные новости',
    description: 'Дайджест новостей за неделю',
    text: 'Что нового на этой неделе:\n\n1. {новость_1}\n2. {новость_2}\n3. {новость_3}\n\nСледите за обновлениями!',
    platforms: ['telegram', 'vk'],
    hashtags: ['новости', 'дайджест'],
    category: 'news',
    uses_count: 12,
    created_at: '2024-12-10',
  },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(demoTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: Template) => {
    // Copy to clipboard and redirect to new post
    navigator.clipboard.writeText(template.text)
    window.location.href = '/dashboard/posts/new?template=' + template.id
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Шаблоны постов</h1>
          <p className="text-gray-400 mt-1">
            Готовые шаблоны для быстрого создания постов
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Создать шаблон
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск шаблонов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{template.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{template.description}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-900/50 rounded-lg p-3 mb-4 max-h-24 overflow-hidden">
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {template.text.substring(0, 120)}...
              </p>
            </div>

            {/* Platforms */}
            <div className="flex items-center gap-2 mb-4">
              {template.platforms.map(platform => {
                const Icon = platformIcons[platform] || MessageSquare
                return (
                  <div
                    key={platform}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: platformColors[platform] + '20' }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: platformColors[platform] }}
                    />
                  </div>
                )
              })}
              <span className="text-xs text-gray-500 ml-auto">
                Использован {template.uses_count} раз
              </span>
            </div>

            {/* Hashtags */}
            {template.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.hashtags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <button
              onClick={() => handleUseTemplate(template)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Использовать
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Шаблоны не найдены
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Создайте первый шаблон'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Создать шаблон
          </button>
        </div>
      )}
    </div>
  )
}
