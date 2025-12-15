'use client'

import { useState } from 'react'
import {
  Cloud, FolderOpen, RefreshCw, Check, AlertCircle,
  ExternalLink, Trash2, Settings, Link2, Video, Image,
  Clock, HardDrive, ChevronDown, ChevronUp, FolderSync
} from 'lucide-react'

// Provider configurations
const CLOUD_PROVIDERS = {
  google_drive: {
    id: 'google_drive',
    name: 'Google Drive',
    icon: '/icons/google-drive.svg',
    color: '#4285F4',
    description: 'Подключите папку с Google Drive',
    supports_public: false,
    placeholder: 'https://drive.google.com/drive/folders/...',
  },
  yandex_disk: {
    id: 'yandex_disk',
    name: 'Яндекс.Диск',
    icon: '/icons/yandex-disk.svg',
    color: '#FFCC00',
    description: 'Подключите папку с Яндекс.Диска',
    supports_public: true,
    placeholder: 'https://disk.yandex.ru/d/...',
  },
}

interface CloudConnection {
  id: string
  provider: string
  folder_name: string | null
  folder_url: string | null
  status: string
  is_public: boolean
  sync_enabled: boolean
  last_sync_at: string | null
  files_synced_total: number
  error_message: string | null
  created_at: string
}

interface CloudStorageConnectProps {
  connections?: CloudConnection[]
  onConnect?: (provider: string, url: string, isPublic: boolean) => Promise<void>
  onSync?: (connectionId: string) => Promise<void>
  onDelete?: (connectionId: string) => Promise<void>
  onToggleSync?: (connectionId: string, enabled: boolean) => Promise<void>
}

export default function CloudStorageConnect({
  connections = [],
  onConnect,
  onSync,
  onDelete,
  onToggleSync,
}: CloudStorageConnectProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [folderUrl, setFolderUrl] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedConnection, setExpandedConnection] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const handleConnect = async () => {
    if (!selectedProvider || !folderUrl) return

    setIsConnecting(true)
    setError(null)

    try {
      await onConnect?.(selectedProvider, folderUrl, isPublic)
      setFolderUrl('')
      setSelectedProvider(null)
      setIsPublic(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения')
    } finally {
      setIsConnecting(false)
    }
  }

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Никогда'
    const date = new Date(dateStr)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'error':
      case 'expired': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'Активно'
      case 'pending': return 'Ожидание'
      case 'error': return 'Ошибка'
      case 'expired': return 'Токен истёк'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Облачные хранилища</h2>
            <p className="text-sm text-gray-400">Синхронизируйте медиа с Google Drive или Яндекс.Диска</p>
          </div>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <FolderOpen className="w-4 h-4" />
          Структура папок
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Folder structure guide */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-medium mb-3">Рекомендуемая структура папок:</h3>
          <div className="font-mono text-sm space-y-1 text-gray-400">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-yellow-400" />
              <span className="text-white">your_folder/</span>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span>videos/</span>
              <span className="text-gray-500 text-xs">.mp4, .mov, .avi</span>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <FolderOpen className="w-4 h-4 text-green-400" />
              <span>photos/</span>
              <span className="text-gray-500 text-xs">.jpg, .png, .webp</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Файлы автоматически адаптируются под каждую соцсеть с умным кропом
          </p>
        </div>
      )}

      {/* Existing connections */}
      {connections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Подключённые хранилища</h3>
          {connections.map(conn => {
            const provider = CLOUD_PROVIDERS[conn.provider as keyof typeof CLOUD_PROVIDERS]
            const isExpanded = expandedConnection === conn.id

            return (
              <div
                key={conn.id}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                {/* Connection header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                  onClick={() => setExpandedConnection(isExpanded ? null : conn.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${provider?.color}20` }}
                    >
                      <HardDrive className="w-5 h-5" style={{ color: provider?.color }} />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {conn.folder_name || provider?.name || conn.provider}
                        {conn.is_public && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                            Публичная
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-3">
                        <span className={getStatusColor(conn.status)}>
                          {getStatusText(conn.status)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(conn.last_sync_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {conn.files_synced_total} файлов
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
                    {/* Error message */}
                    {conn.error_message && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-300">{conn.error_message}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <Video className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                        <div className="text-xs text-gray-400">Видео</div>
                        <div className="font-semibold">-</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <Image className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                        <div className="text-xs text-gray-400">Фото</div>
                        <div className="font-semibold">-</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <FolderSync className="w-5 h-5 mx-auto mb-1 text-green-400" />
                        <div className="text-xs text-gray-400">Всего</div>
                        <div className="font-semibold">{conn.files_synced_total}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSync?.(conn.id)
                        }}
                        disabled={conn.status !== 'active'}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Синхронизировать
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleSync?.(conn.id, !conn.sync_enabled)
                        }}
                        className={`px-4 py-2 rounded-lg border transition ${
                          conn.sync_enabled
                            ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                            : 'border-white/10 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        {conn.sync_enabled ? 'Вкл' : 'Выкл'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Удалить подключение?')) {
                            onDelete?.(conn.id)
                          }
                        }}
                        className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add new connection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400">Добавить хранилище</h3>

        {/* Provider selection */}
        <div className="grid grid-cols-2 gap-3">
          {Object.values(CLOUD_PROVIDERS).map(provider => (
            <button
              key={provider.id}
              onClick={() => {
                setSelectedProvider(provider.id)
                setError(null)
              }}
              className={`p-4 rounded-xl border text-left transition ${
                selectedProvider === provider.id
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${provider.color}20` }}
                >
                  <HardDrive className="w-4 h-4" style={{ color: provider.color }} />
                </div>
                <span className="font-medium">{provider.name}</span>
              </div>
              <p className="text-sm text-gray-400">{provider.description}</p>
              {provider.supports_public && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Поддержка публичных ссылок
                </div>
              )}
            </button>
          ))}
        </div>

        {/* URL input */}
        {selectedProvider && (
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-sm font-medium mb-2">Ссылка на папку</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={folderUrl}
                  onChange={(e) => setFolderUrl(e.target.value)}
                  placeholder={CLOUD_PROVIDERS[selectedProvider as keyof typeof CLOUD_PROVIDERS]?.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Public folder toggle (for Yandex) */}
            {CLOUD_PROVIDERS[selectedProvider as keyof typeof CLOUD_PROVIDERS]?.supports_public && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-medium">Публичная ссылка</span>
                  <p className="text-xs text-gray-400">Не требует авторизации</p>
                </div>
              </label>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Connect button */}
            <button
              onClick={handleConnect}
              disabled={!folderUrl || isConnecting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Подключение...
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  Подключить
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
