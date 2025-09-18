// 交互功能 Hooks
import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './use-auth'
import { InteractionService } from '@/lib/interaction/interaction-service'
import {
  InteractionStats,
  Comment,
  Favorite,
} from '@/lib/interaction/interaction-types'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/utils/logger'

// 点赞 Hook
export function useLike(
  targetId: string,
  targetType: 'post' | 'resource' | 'vibe'
) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 获取初始状态
  useEffect(() => {
    if (targetId) {
      InteractionService.getInteractionStats(targetId, targetType, user?.id)
        .then(stats => {
          setIsLiked(stats.userLiked || false)
          setLikeCount(stats.likes)
        })
        .catch(logger.error)
    }
  }, [targetId, targetType, user?.id])

  const toggleLike = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // 未登录跳转到登录页
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const newLikedState = await InteractionService.toggleLike(
        targetId,
        targetType,
        user.id
      )
      setIsLiked(newLikedState)
      setLikeCount(prev => (newLikedState ? prev + 1 : prev - 1))
    } catch (error) {
      logger.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, targetId, targetType, router])

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
  }
}

// 收藏 Hook
export function useFavorite(
  targetId: string,
  targetType: 'post' | 'resource' | 'vibe'
) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 获取初始状态
  useEffect(() => {
    if (targetId) {
      InteractionService.getInteractionStats(targetId, targetType, user?.id)
        .then(stats => {
          setIsFavorited(stats.userFavorited || false)
          setFavoriteCount(stats.favorites)
        })
        .catch(logger.error)
    }
  }, [targetId, targetType, user?.id])

  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const newFavoritedState = await InteractionService.toggleFavorite(
        targetId,
        targetType,
        user.id
      )
      setIsFavorited(newFavoritedState)
      setFavoriteCount(prev => (newFavoritedState ? prev + 1 : prev - 1))
    } catch (error) {
      logger.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, targetId, targetType, router])

  return {
    isFavorited,
    favoriteCount,
    isLoading,
    toggleFavorite,
  }
}

// 评论 Hook（支持分页）
export function useComments(
  targetId: string,
  targetType: 'post' | 'resource' | 'vibe',
  options?: {
    pageSize?: number
  }
) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasMore: false,
    pageSize: options?.pageSize || 10,
  })

  // 获取评论列表
  const fetchComments = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      try {
        const data = await InteractionService.getComments(
          targetId,
          targetType,
          {
            page,
            pageSize: pagination.pageSize,
          }
        )

        if (append) {
          setComments(prev => [...prev, ...data.comments])
        } else {
          setComments(data.comments)
        }

        setPagination({
          page: data.page,
          total: data.total,
          hasMore: data.hasMore,
          pageSize: data.pageSize,
        })
      } catch (error) {
        logger.error('Failed to fetch comments:', error)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [targetId, targetType, pagination.pageSize]
  )

  // 加载更多评论
  const loadMoreComments = useCallback(() => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchComments(pagination.page + 1, true)
    }
  }, [fetchComments, pagination.hasMore, pagination.page, isLoadingMore])

  useEffect(() => {
    if (targetId) {
      fetchComments(1, false)
    }
  }, [targetId, fetchComments])

  // 发布评论（支持评分）
  const createComment = useCallback(
    async (content: string, rating?: number) => {
      if (!isAuthenticated || !user) {
        router.push('/login')
        return
      }

      setIsSubmitting(true)
      try {
        const newComment = await InteractionService.createComment(
          { targetId, targetType, content, rating },
          user.id,
          user.name,
          user.avatar
        )
        setComments(prev => [newComment, ...prev])
        return newComment
      } catch (error) {
        logger.error('Failed to create comment:', error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [isAuthenticated, user, targetId, targetType, router]
  )

  // 删除评论
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!user) return

      try {
        const success = await InteractionService.deleteComment(
          commentId,
          user.id
        )
        if (success) {
          setComments(prev => prev.filter(c => c.id !== commentId))
        }
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    },
    [user]
  )

  return {
    comments,
    isLoading,
    isLoadingMore,
    isSubmitting,
    pagination,
    createComment,
    deleteComment,
    loadMoreComments,
    refreshComments: () => fetchComments(1, false),
  }
}

// 评论点赞 Hook
export function useCommentLike(commentId: string) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 获取初始状态
  useEffect(() => {
    if (commentId) {
      InteractionService.getCommentLikeStats(commentId, user?.id)
        .then(stats => {
          setIsLiked(stats.isLiked)
          setLikeCount(stats.likeCount)
        })
        .catch(logger.error)
    }
  }, [commentId, user?.id])

  const toggleLike = useCallback(async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const newLikedState = await InteractionService.toggleCommentLike(
        commentId,
        user.id
      )
      setIsLiked(newLikedState)
      setLikeCount(prev => (newLikedState ? prev + 1 : prev - 1))
    } catch (error) {
      console.error('Failed to toggle comment like:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, commentId, router])

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
  }
}

// 评分 Hook (仅用于资源)
export function useRating(targetId: string) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [userRating, setUserRating] = useState<number | undefined>()
  const [averageRating, setAverageRating] = useState<number | undefined>()
  const [totalRatings, setTotalRatings] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 获取评分统计
  useEffect(() => {
    if (targetId) {
      InteractionService.getInteractionStats(targetId, 'resource', user?.id)
        .then(stats => {
          setUserRating(stats.userRating)
          setAverageRating(stats.averageRating)
          setTotalRatings(stats.totalRatings || 0)
        })
        .catch(logger.error)
    }
  }, [targetId, user?.id])

  // 提交评分
  const rateResource = useCallback(
    async (score: number, review?: string) => {
      if (!isAuthenticated || !user) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      try {
        await InteractionService.rateResource(
          { targetId, score, review },
          user.id
        )
        setUserRating(score)

        // 重新获取统计以更新平均分
        const stats = await InteractionService.getInteractionStats(
          targetId,
          'resource',
          user.id
        )
        setAverageRating(stats.averageRating)
        setTotalRatings(stats.totalRatings || 0)
      } catch (error) {
        console.error('Failed to rate resource:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, targetId, router]
  )

  return {
    userRating,
    averageRating,
    totalRatings,
    isLoading,
    rateResource,
  }
}

// 交互统计 Hook
export function useInteractionStats(
  targetId: string,
  targetType: 'post' | 'resource' | 'vibe'
) {
  const { user } = useAuth()
  const [stats, setStats] = useState<InteractionStats>({
    likes: 0,
    favorites: 0,
    comments: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (targetId) {
      setIsLoading(true)
      InteractionService.getInteractionStats(targetId, targetType, user?.id)
        .then(setStats)
        .catch(logger.error)
        .finally(() => setIsLoading(false))
    }
  }, [targetId, targetType, user?.id])

  return { stats, isLoading }
}

// 用户收藏列表 Hook
export function useUserFavorites(type?: 'post' | 'resource' | 'vibe') {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setFavorites([])
      return
    }

    setLoading(true)
    try {
      const data = await InteractionService.getUserFavorites(user.id, type)
      setFavorites(data)
    } catch (error) {
      console.error('Failed to fetch user favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user, isAuthenticated, type])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    favorites,
    loading,
    refresh: fetchFavorites,
  }
}

// 用户评论列表 Hook
export function useUserComments(type?: 'post' | 'resource' | 'vibe') {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setComments([])
      return
    }

    setLoading(true)
    try {
      const data = await InteractionService.getUserComments(user.id, type)
      setComments(data)
    } catch (error) {
      console.error('Failed to fetch user comments:', error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [user, isAuthenticated, type])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    comments,
    loading,
    refresh: fetchComments,
  }
}

// 资源评分统计 Hook
export function useResourceRating(resourceId: string) {
  const [ratingStats, setRatingStats] = useState<{
    averageRating: number
    totalRatings: number
    ratingDistribution: Record<number, number>
  }>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [loading, setLoading] = useState(false)

  const fetchRatingStats = useCallback(async () => {
    if (!resourceId) return

    setLoading(true)
    try {
      const stats =
        await InteractionService.getResourceRatingFromComments(resourceId)
      setRatingStats(stats)
    } catch (error) {
      console.error('Failed to fetch rating stats:', error)
    } finally {
      setLoading(false)
    }
  }, [resourceId])

  useEffect(() => {
    fetchRatingStats()
  }, [fetchRatingStats])

  return {
    ratingStats,
    loading,
    refresh: fetchRatingStats,
  }
}
