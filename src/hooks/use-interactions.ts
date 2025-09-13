// 交互功能 Hooks
import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './use-auth'
import { InteractionService } from '@/lib/interaction/interaction-service'
import { InteractionStats, Comment, Favorite } from '@/lib/interaction/interaction-types'
import { useRouter } from 'next/navigation'

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
        .catch(console.error)
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
      console.error('Failed to toggle like:', error)
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
        .catch(console.error)
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
      console.error('Failed to toggle favorite:', error)
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

// 评论 Hook
export function useComments(
  targetId: string,
  targetType: 'post' | 'resource' | 'vibe'
) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 获取评论列表
  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await InteractionService.getComments(targetId, targetType)
      setComments(data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [targetId, targetType])

  useEffect(() => {
    if (targetId) {
      fetchComments()
    }
  }, [targetId, fetchComments])

  // 发布评论
  const createComment = useCallback(
    async (content: string) => {
      if (!isAuthenticated || !user) {
        router.push('/login')
        return
      }

      setIsSubmitting(true)
      try {
        const newComment = await InteractionService.createComment(
          { targetId, targetType, content },
          user.id,
          user.name,
          user.avatar
        )
        setComments(prev => [newComment, ...prev])
        return newComment
      } catch (error) {
        console.error('Failed to create comment:', error)
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
    isSubmitting,
    createComment,
    deleteComment,
    refreshComments: fetchComments,
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
        .catch(console.error)
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
        .catch(console.error)
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
