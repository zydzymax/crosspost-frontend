'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  User, Bell, Palette, Globe, CreditCard, Shield,
  Moon, Sun, ChevronRight, Save, Loader2,
  MessageSquare, Instagram, Youtube, Music2
} from 'lucide-react'

interface Settings {
  notifications: {
    email_on_publish: boolean
    telegram_on_error: boolean
    daily_digest: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'ru' | 'en'
    timezone: string
    default_platforms: string[]
  }
  integrations: {
    auto_hashtags: boolean
    watermark_enabled: boolean
    schedule_optimization: boolean
  }
}

const platformIcons: Record<string, any> = {
  telegram: MessageSquare,
  vk: MessageSquare,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
}

const settingsSections = [
  { id: 'general', name: 'Основные', icon: User },
  { id: 'notifications', name: 'Уведомления', icon: Bell },
  { id: 'appearance', name: 'Внешний вид', icon: Palette },
  { id: 'integrations', name: 'Интеграции', icon: Globe },
  { id: 'billing', name: 'Подписка', icon: CreditCard, href: '/dashboard/settings/billing' },
  { id: 'security', name: 'Безопасность', icon: Shield },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email_on_publish: true,
      telegram_on_error: true,
      daily_digest: false,
    },
    preferences: {
      theme: 'dark',
      language: 'ru',
      timezone: 'Europe/Moscow',
      default_platforms: ['telegram', 'vk'],
    },
    integrations: {
      auto_hashtags: true,
      watermark_enabled: false,
      schedule_optimization: true,
    },
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const togglePlatform = (platform: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        default_platforms: prev.preferences.default_platforms.includes(platform)
          ? prev.preferences.default_platforms.filter(p => p !== platform)
          : [...prev.preferences.default_platforms, platform],
      },
    }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Настройки</h1>
          <p className="text-gray-400 mt-1">
            Управление аккаунтом и предпочтениями
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {settingsSections.map(section => {
              const Icon = section.icon
              if (section.href) {
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className="flex items-center justify-between px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {section.name}
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )
              }
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {section.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          {/* General */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Основные настройки</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Язык интерфейса
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Часовой пояс
                </label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Europe/Moscow">Москва (UTC+3)</option>
                  <option value="Europe/Kaliningrad">Калининград (UTC+2)</option>
                  <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                  <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Платформы по умолчанию
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(platformIcons).map(([platform, Icon]) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        settings.preferences.default_platforms.includes(platform)
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Уведомления</h2>

              {[
                { key: 'email_on_publish', label: 'Email при публикации', desc: 'Получать письмо после успешной публикации' },
                { key: 'telegram_on_error', label: 'Telegram при ошибках', desc: 'Уведомлять в Telegram о проблемах' },
                { key: 'daily_digest', label: 'Ежедневный дайджест', desc: 'Сводка активности за день' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.notifications[item.key as keyof typeof settings.notifications]
                        ? 'bg-purple-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications[item.key as keyof typeof settings.notifications]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Внешний вид</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Тема оформления
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'light', label: 'Светлая', icon: Sun },
                    { value: 'dark', label: 'Темная', icon: Moon },
                  ].map(theme => {
                    const Icon = theme.icon
                    return (
                      <button
                        key={theme.value}
                        onClick={() => updateSetting('preferences', 'theme', theme.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          settings.preferences.theme === theme.value
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {theme.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Интеграции</h2>

              {[
                { key: 'auto_hashtags', label: 'Авто-хештеги', desc: 'Автоматически добавлять релевантные хештеги' },
                { key: 'watermark_enabled', label: 'Водяной знак', desc: 'Добавлять водяной знак на изображения' },
                { key: 'schedule_optimization', label: 'Оптимизация расписания', desc: 'Автоматически выбирать лучшее время публикации' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => updateSetting('integrations', item.key, !settings.integrations[item.key as keyof typeof settings.integrations])}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.integrations[item.key as keyof typeof settings.integrations]
                        ? 'bg-purple-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.integrations[item.key as keyof typeof settings.integrations]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Безопасность</h2>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="font-medium text-white mb-1">Telegram авторизация</div>
                <div className="text-sm text-gray-400 mb-3">
                  Вы авторизованы через Telegram. Это безопасный способ входа.
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Shield className="w-4 h-4" />
                  Аккаунт защищен
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button className="text-red-400 hover:text-red-300 transition-colors">
                  Выйти со всех устройств
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
