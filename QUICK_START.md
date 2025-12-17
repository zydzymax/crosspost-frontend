# Quick Start

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (sovani-crosspost)

## 1. Clone & Setup

```bash
git clone https://github.com/zydzymax/crosspost-frontend.git
cd crosspost-frontend

# Install dependencies
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Required variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 3. Generate API Types

```bash
# Generate TypeScript types from OpenAPI spec
npm run generate-api-types
```

## 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 5. Build for Production

```bash
npm run build
npm run export

# Static files in out/ directory
```

## Useful Commands

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Format
npm run format
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Home/Landing
│   ├── login/             # Authentication
│   └── dashboard/
│       ├── page.tsx       # Main dashboard
│       ├── posts/         # Post management
│       ├── templates/     # Content templates
│       └── settings/      # User settings
├── components/            # Reusable components
└── lib/
    └── api/              # API client & types
```

See main [README.md](README.md) for full documentation.
