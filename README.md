# Crosspost Frontend

[![CI](https://github.com/zydzymax/crosspost-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/zydzymax/crosspost-frontend/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

Веб-интерфейс для кроссплатформенной публикации контента в социальные сети.

> **Quick Start:** See [QUICK_START.md](QUICK_START.md) for fast setup.

## Функциональность

- 📱 Создание и публикация постов на несколько платформ
- 📊 Мониторинг статуса публикаций
- 📝 Шаблоны для быстрого создания контента
- ⚙️ Настройка подключенных аккаунтов
- 📈 Статистика и аналитика

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **openapi-fetch** - Типизированный API клиент

## Структура проекта

```
src/
├── app/           # Next.js App Router
│   ├── dashboard/ # Основные страницы дашборда
│   └── login/     # Страница авторизации
├── components/    # React компоненты
└── lib/           # Утилиты и API клиент
```

## Интеграция с API

Фронтенд использует типизированный клиент, сгенерированный из OpenAPI спецификации:

```typescript
import { api, postsApi } from '@/lib/api/client'

// Типизированные вызовы API
const posts = await postsApi.list()
const newPost = await postsApi.create({ title: 'New Post', platforms: ['instagram', 'vk'] })
```

## Деплой

Проект собирается в статические файлы и раздаётся через Nginx:

```bash
npm run build
# Файлы в out/ раздаются через Nginx
```

## Связанные сервисы

- [sovani-crosspost](https://github.com/zydzymax/sovani-crosspost) - Backend API
- [headofsales-frontend](https://github.com/zydzymax/headofsales-frontend) - Head of Sales UI
