// 资源相关类型定义

export interface Resource {
  id: string
  title: string
  description: string
  detailedDescription?: string
  url: string
  category: string
  tags: string[]
  author: string
  authorId: string
  authorAvatar?: string
  rating: number
  ratingCount: number
  ratingDistribution?: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  viewCount: number
  likeCount: number
  commentCount: number
  downloadCount?: number
  featured: boolean
  screenshots?: string[]
  createdAt: Date
  updatedAt: Date
  slug: string
}

export interface ResourceComment {
  id: string
  resourceId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  rating?: number
  likeCount: number
  isLiked?: boolean
  parentId?: string
  replies?: ResourceComment[]
  createdAt: Date
  updatedAt: Date
}

export interface ResourceRating {
  id: string
  resourceId: string
  userId: string
  userName: string
  rating: number
  review?: string
  helpful: number
  createdAt: Date
}

export interface ResourceFilter {
  category?: string
  tags?: string[]
  rating?: number
  search?: string
  sortBy?: 'latest' | 'popular' | 'rating'
}