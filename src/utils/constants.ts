export const APP_NAME = 'MyCoding'
export const APP_DESCRIPTION = '基于 Next.js 14 构建的现代化Web应用'

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  DASHBOARD: '/dashboard',
} as const

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  
  // 用户相关
  USERS: {
    PROFILE: '/api/users/profile',
    LIST: '/api/users',
    DETAIL: '/api/users/:id',
  },
  
  // 资源相关
  RESOURCES: {
    LIST: '/api/resources',
    DETAIL: '/api/resources/:id',
    FAVORITE: '/api/resources/:id/favorite',
    COMMENTS: '/api/resources/:id/comments',
  },
  
  // 文章相关
  ARTICLES: {
    LIST: '/api/articles',
    DETAIL: '/api/articles/:id',
    COMMENTS: '/api/articles/:id/comments',
  },
  
  // 动态相关
  VIBES: {
    LIST: '/api/vibes',
    DETAIL: '/api/vibes/:id',
    COMMENTS: '/api/vibes/:id/comments',
  },
  
  // 通知相关
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count',
  },
  
  // 上传相关
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file',
    AVATAR: '/api/upload/avatar',
  },
  
  // 搜索
  SEARCH: {
    GLOBAL: '/api/search',
    RESOURCES: '/api/search/resources',
    ARTICLES: '/api/search/articles',
    USERS: '/api/search/users',
  },
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