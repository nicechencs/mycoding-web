import { useState, useCallback } from 'react'

interface UseLikeReturn {
  likeCount: number
  isLiked: boolean
  handleLike: () => void
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
  setIsLiked: (liked: boolean) => void
}

/**
 * 通用的点赞逻辑Hook
 * @param initialCount 初始点赞数
 * @param initialLiked 初始点赞状态
 * @returns 点赞相关状态和方法
 */
export function useLike(
  initialCount: number = 0,
  initialLiked: boolean = false
): UseLikeReturn {
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLiked, setIsLiked] = useState(initialLiked)

  const handleLike = useCallback(() => {
    if (isLiked) {
      setLikeCount(prev => Math.max(0, prev - 1))
      setIsLiked(false)
    } else {
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }, [isLiked])

  return {
    likeCount,
    isLiked,
    handleLike,
    setLikeCount,
    setIsLiked
  }
}

/**
 * 带有异步API调用的点赞Hook
 */
interface UseLikeWithApiOptions {
  onLike?: (itemId: string) => Promise<void>
  onUnlike?: (itemId: string) => Promise<void>
}

export function useLikeWithApi(
  itemId: string,
  initialCount: number = 0,
  initialLiked: boolean = false,
  options?: UseLikeWithApiOptions
) {
  const { likeCount, isLiked, setLikeCount, setIsLiked } = useLike(initialCount, initialLiked)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLike = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (isLiked && options?.onUnlike) {
        await options.onUnlike(itemId)
        setLikeCount(prev => Math.max(0, prev - 1))
        setIsLiked(false)
      } else if (!isLiked && options?.onLike) {
        await options.onLike(itemId)
        setLikeCount(prev => prev + 1)
        setIsLiked(true)
      } else {
        // 没有API调用时的本地处理
        if (isLiked) {
          setLikeCount(prev => Math.max(0, prev - 1))
          setIsLiked(false)
        } else {
          setLikeCount(prev => prev + 1)
          setIsLiked(true)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '点赞操作失败')
      // 回滚状态
      if (isLiked) {
        setLikeCount(prev => prev + 1)
      } else {
        setLikeCount(prev => Math.max(0, prev - 1))
      }
    } finally {
      setLoading(false)
    }
  }, [itemId, isLiked, options])

  return {
    likeCount,
    isLiked,
    handleLike,
    loading,
    error
  }
}