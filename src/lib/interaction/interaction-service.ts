// 交互服务 - 模拟API调用
import {
  Like,
  Favorite,
  Comment,
  Rating,
  InteractionStats,
  CreateCommentData,
  CreateRatingData,
} from './interaction-types'

const STORAGE_KEYS = {
  LIKES: 'mycoding_likes',
  FAVORITES: 'mycoding_favorites',
  COMMENTS: 'mycoding_comments',
  RATINGS: 'mycoding_ratings',
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取存储的数据
function getStoredData<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// 保存数据到存储
function saveData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

export class InteractionService {
  // 点赞/取消点赞
  static async toggleLike(
    targetId: string,
    targetType: 'post' | 'resource' | 'vibe',
    userId: string
  ): Promise<boolean> {
    await delay(300)

    const likes = getStoredData<Like>(STORAGE_KEYS.LIKES)
    const existingIndex = likes.findIndex(
      l =>
        l.targetId === targetId &&
        l.targetType === targetType &&
        l.userId === userId
    )

    if (existingIndex > -1) {
      // 取消点赞
      likes.splice(existingIndex, 1)
      saveData(STORAGE_KEYS.LIKES, likes)
      return false
    } else {
      // 添加点赞
      const newLike: Like = {
        id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        targetId,
        targetType,
        createdAt: new Date(),
      }
      likes.push(newLike)
      saveData(STORAGE_KEYS.LIKES, likes)
      return true
    }
  }

  // 收藏/取消收藏
  static async toggleFavorite(
    targetId: string,
    targetType: 'post' | 'resource' | 'vibe',
    userId: string
  ): Promise<boolean> {
    await delay(300)

    const favorites = getStoredData<Favorite>(STORAGE_KEYS.FAVORITES)
    const existingIndex = favorites.findIndex(
      f =>
        f.targetId === targetId &&
        f.targetType === targetType &&
        f.userId === userId
    )

    if (existingIndex > -1) {
      // 取消收藏
      favorites.splice(existingIndex, 1)
      saveData(STORAGE_KEYS.FAVORITES, favorites)
      return false
    } else {
      // 添加收藏
      const newFavorite: Favorite = {
        id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        targetId,
        targetType,
        createdAt: new Date(),
      }
      favorites.push(newFavorite)
      saveData(STORAGE_KEYS.FAVORITES, favorites)
      return true
    }
  }

  // 发布评论
  static async createComment(
    data: CreateCommentData,
    userId: string,
    userName: string,
    userAvatar?: string
  ): Promise<Comment> {
    await delay(500)

    const comments = getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      userAvatar,
      targetId: data.targetId,
      targetType: data.targetType,
      content: data.content,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    comments.push(newComment)
    saveData(STORAGE_KEYS.COMMENTS, comments)
    return newComment
  }

  // 获取评论列表
  static async getComments(
    targetId: string,
    targetType: 'post' | 'resource' | 'vibe'
  ): Promise<Comment[]> {
    await delay(300)

    const comments = getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    return comments
      .filter(c => c.targetId === targetId && c.targetType === targetType)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }

  // 删除评论
  static async deleteComment(
    commentId: string,
    userId: string
  ): Promise<boolean> {
    await delay(300)

    const comments = getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    const index = comments.findIndex(
      c => c.id === commentId && c.userId === userId
    )

    if (index > -1) {
      comments.splice(index, 1)
      saveData(STORAGE_KEYS.COMMENTS, comments)
      return true
    }
    return false
  }

  // 添加或更新评分
  static async rateResource(
    data: CreateRatingData,
    userId: string
  ): Promise<Rating> {
    await delay(400)

    const ratings = getStoredData<Rating>(STORAGE_KEYS.RATINGS)
    const existingIndex = ratings.findIndex(
      r => r.targetId === data.targetId && r.userId === userId
    )

    const rating: Rating = {
      id:
        existingIndex > -1
          ? ratings[existingIndex].id
          : `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      targetId: data.targetId,
      targetType: 'resource',
      score: data.score,
      review: data.review,
      createdAt:
        existingIndex > -1 ? ratings[existingIndex].createdAt : new Date(),
    }

    if (existingIndex > -1) {
      ratings[existingIndex] = rating
    } else {
      ratings.push(rating)
    }

    saveData(STORAGE_KEYS.RATINGS, ratings)
    return rating
  }

  // 获取交互统计
  static async getInteractionStats(
    targetId: string,
    targetType: 'post' | 'resource' | 'vibe',
    userId?: string
  ): Promise<InteractionStats> {
    await delay(200)

    const likes = getStoredData<Like>(STORAGE_KEYS.LIKES)
    const favorites = getStoredData<Favorite>(STORAGE_KEYS.FAVORITES)
    const comments = getStoredData<Comment>(STORAGE_KEYS.COMMENTS)

    const targetLikes = likes.filter(
      l => l.targetId === targetId && l.targetType === targetType
    )
    const targetFavorites = favorites.filter(
      f => f.targetId === targetId && f.targetType === targetType
    )
    const targetComments = comments.filter(
      c => c.targetId === targetId && c.targetType === targetType
    )

    const stats: InteractionStats = {
      likes: targetLikes.length,
      favorites: targetFavorites.length,
      comments: targetComments.length,
    }

    // 如果是资源，计算评分
    if (targetType === 'resource') {
      const ratings = getStoredData<Rating>(STORAGE_KEYS.RATINGS)
      const targetRatings = ratings.filter(r => r.targetId === targetId)

      if (targetRatings.length > 0) {
        const totalScore = targetRatings.reduce((sum, r) => sum + r.score, 0)
        stats.averageRating = totalScore / targetRatings.length
        stats.totalRatings = targetRatings.length

        if (userId) {
          const userRating = targetRatings.find(r => r.userId === userId)
          if (userRating) {
            stats.userRating = userRating.score
          }
        }
      }
    }

    // 如果提供了用户ID，检查用户是否已点赞/收藏
    if (userId) {
      stats.userLiked = targetLikes.some(l => l.userId === userId)
      stats.userFavorited = targetFavorites.some(f => f.userId === userId)
    }

    return stats
  }

  // 获取用户的收藏列表
  static async getUserFavorites(
    userId: string,
    targetType?: 'post' | 'resource' | 'vibe'
  ): Promise<Favorite[]> {
    await delay(300)

    const favorites = getStoredData<Favorite>(STORAGE_KEYS.FAVORITES)
    let userFavorites = favorites.filter(f => f.userId === userId)

    if (targetType) {
      userFavorites = userFavorites.filter(f => f.targetType === targetType)
    }

    return userFavorites.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  // 获取用户的点赞列表
  static async getUserLikes(
    userId: string,
    targetType?: 'post' | 'resource' | 'vibe'
  ): Promise<Like[]> {
    await delay(300)

    const likes = getStoredData<Like>(STORAGE_KEYS.LIKES)
    let userLikes = likes.filter(l => l.userId === userId)

    if (targetType) {
      userLikes = userLikes.filter(l => l.targetType === targetType)
    }

    return userLikes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  // 获取用户的评论列表
  static async getUserComments(userId: string): Promise<Comment[]> {
    await delay(300)

    const comments = getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    return comments
      .filter(c => c.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
}
