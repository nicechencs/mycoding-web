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

// Resource types
export interface Resource {
  id: string
  title: string
  description: string
  url: string
  category: string
  tags: string[]
  rating: number
  ratingCount: number
  author: string
  createdAt: Date
  updatedAt: Date
  featured?: boolean
  image?: string
  viewCount: number
  likeCount: number
  commentCount: number
}

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

export interface ResourceComment {
  id: string
  resourceId: string
  content: string
  author: User
  parentId?: string
  likeCount: number
  createdAt: Date
  updatedAt: Date
  replies?: ResourceComment[]
  isLiked?: boolean
}

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
  content: string
  author: User
  createdAt: Date
}