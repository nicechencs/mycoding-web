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
}

export interface CreateRatingData {
  targetId: string
  score: number
  review?: string
}
