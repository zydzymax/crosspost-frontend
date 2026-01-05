import createClient from 'openapi-fetch'
import type { paths } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crosspost.saleswhisper.pro/api'

// Create typed API client
export const api = createClient<paths>({
  baseUrl: API_BASE_URL,
})

// Helper to add auth token to requests
export function withAuth(token: string) {
  return createClient<paths>({
    baseUrl: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Auth endpoints
export const authApi = {
  sendCode: (username: string) =>
    api.POST('/api/v1/auth/send-code', {
      body: { username },
    }),

  verifyCode: (username: string, code: string) =>
    api.POST('/api/v1/auth/verify-code', {
      body: { username, code },
    }),

  getMe: (token: string) =>
    withAuth(token).GET('/api/v1/auth/me'),

  logout: (token: string) =>
    withAuth(token).POST('/api/v1/auth/logout'),
}

// User endpoints
export const userApi = {
  getAccounts: (token: string) =>
    withAuth(token).GET('/api/v1/user/accounts'),

  addAccount: (token: string, data: { platform: string; credentials: Record<string, string> }) =>
    withAuth(token).POST('/api/v1/user/accounts', {
      body: data as any,
    }),

  removeAccount: (token: string, accountId: string) =>
    withAuth(token).DELETE('/api/v1/user/accounts/{account_id}', {
      params: { path: { account_id: accountId } },
    }),

  getTopics: (token: string) =>
    withAuth(token).GET('/api/v1/user/topics'),

  getStats: (token: string) =>
    withAuth(token).GET('/api/v1/user/stats'),

  updateSettings: (token: string, settings: Record<string, any>) =>
    withAuth(token).PATCH('/api/v1/user/settings', {
      body: settings as any,
    }),
}

// Content Plan endpoints
export const contentPlanApi = {
  generate: (token: string, data: { topic_id: string; posts_count: number; date_range: { start: string; end: string } }) =>
    withAuth(token).POST('/api/v1/content-plan/generate', {
      body: data as any,
    }),

  list: (token: string, limit = 20, offset = 0) =>
    withAuth(token).GET('/api/v1/content-plan/', {
      params: { query: { limit, offset } },
    }),

  get: (token: string, planId: string) =>
    withAuth(token).GET('/api/v1/content-plan/{plan_id}', {
      params: { path: { plan_id: planId } },
    }),

  activate: (token: string, planId: string) =>
    withAuth(token).POST('/api/v1/content-plan/{plan_id}/activate', {
      params: { path: { plan_id: planId } },
    }),

  delete: (token: string, planId: string) =>
    withAuth(token).DELETE('/api/v1/content-plan/{plan_id}', {
      params: { path: { plan_id: planId } },
    }),
}

// Pricing endpoints
export const pricingApi = {
  getPlatforms: () => api.GET('/api/v1/pricing/platforms'),

  getImageProviders: () => api.GET('/api/v1/pricing/image-providers'),

  getVideoProviders: () => api.GET('/api/v1/pricing/video-providers'),

  getSubscriptionPlans: () => api.GET('/api/v1/pricing/subscription-plans'),

  calculate: (params: {
    platforms: string[]
    posts_per_month: number
    image_provider?: string
    images_per_post?: number
  }) =>
    api.GET('/api/v1/pricing/calculate', {
      params: { query: params as any },
    }),
}

// Health check

export default api
