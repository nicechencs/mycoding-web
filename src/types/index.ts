// Global type definitions

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type Theme = 'light' | 'dark'

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
  }
}

// Resource types - 从resource.ts导出
export type { Resource, ResourceComment } from './resource'

export interface ResourceCategory {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

export interface ResourceRating {
  id: string
  resourceId: string
  userId: string
  rating: number
  createdAt: Date
}

// ResourceComment 已从 './resource' 导出

export interface ResourceRatingDistribution {
  1: number
  2: number
  3: number
  4: number
  5: number
}

// Community types
export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  author: User
  category: string
  tags: string[]
  coverImage?: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
  featured?: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: Date
  updatedAt: Date
}

// Vibe types
export interface Vibe {
  id: string
  content: string
  author: User
  images?: string[]
  tags: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  createdAt: Date
  isLiked?: boolean
}

export interface VibeComment {
  id: string
  vibeId: string
  content: string
  author: User
  createdAt: Date
}
