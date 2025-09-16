// 交互相关类型定义

export interface Like {
  id: string
  userId: string
  targetId: string
  targetType: 'post' | 'resource' | 'vibe' | 'comment'
  createdAt: Date
}

export interface Favorite {
  id: string
  userId: string
  targetId: string
  targetType: 'post' | 'resource' | 'vibe'
  createdAt: Date
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  targetId: string
  targetType: 'post' | 'resource' | 'vibe'
  content: string
  likes: number
  createdAt: Date
  updatedAt: Date
  rating?: number // 1-5，仅资源评论可能有评分
  replies?: Comment[] // 支持回复
  parentId?: string // 回复的父评论ID
}

export interface Rating {
  id: string
  userId: string
  targetId: string
  targetType: 'resource'
  score: number // 1-5
  review?: string
  createdAt: Date
}

export interface InteractionStats {
  likes: number
  favorites: number
  comments: number
  averageRating?: number
  totalRatings?: number
  userLiked?: boolean
  userFavorited?: boolean
  userRating?: number
}

export interface CreateCommentData {
  targetId: string
  targetType: 'post' | 'resource' | 'vibe'
  content: string
  rating?: number // 1-5，仅资源评论可能有评分
}

export interface CreateRatingData {
  targetId: string
  score: number
  review?: string
}
