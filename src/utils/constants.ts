export const APP_NAME = 'MyCoding'
export const APP_DESCRIPTION = '基于 Next.js 14 构建的现代化Web应用'

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  DASHBOARD: '/dashboard',
} as const

export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  POSTS: '/api/posts',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const STORAGE_KEYS = {
  THEME: 'theme',
  USER_PREFERENCES: 'user-preferences',
  AUTH_TOKEN: 'auth-token',
} as const