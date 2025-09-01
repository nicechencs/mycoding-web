import { useState, useEffect, useCallback } from 'react'
import { 
  getResourceBySlug, 
  getResourceComments, 
  getRelatedResources 
} from '@/lib/mock/resources'
import type { Resource, ResourceComment, ResourceRatingDistribution } from '@/types/resource'

/**
 * UseResourceDetail Hook 的返回类型
 */
export interface UseResourceDetailReturn {
  // 数据
  resource: Resource | null
  comments: ResourceComment[]
  relatedResources: Resource[]
  ratingDistribution: ResourceRatingDistribution | null
  
  // 状态
  loading: boolean
  error: string | null
  
  // 操作
  refresh: () => void
}

/**
 * 资源详情数据管理 Hook
 * 
 * 提供统一的数据获取、状态管理和错误处理功能
 * 
 * @param slug 资源的 slug 标识符
 * @returns UseResourceDetailReturn 包含数据和操作方法的对象
 * 
 * @example
 * ```tsx
 * const { resource, comments, loading, error, refresh } = useResourceDetail(slug)
 * 
 * if (loading) return <div>Loading...</div>
 * if (error) return <div>Error: {error}</div>
 * if (!resource) return <div>Resource not found</div>
 * 
 * return (
 *   <div>
 *     <h1>{resource.title}</h1>
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * )
 * ```
 */
export function useResourceDetail(slug: string): UseResourceDetailReturn {
  // 状态管理
  const [resource, setResource] = useState<Resource | null>(null)
  const [comments, setComments] = useState<ResourceComment[]>([])
  const [relatedResources, setRelatedResources] = useState<Resource[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<ResourceRatingDistribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 获取资源详情数据
   * 使用 useCallback 优化性能，避免不必要的重新创建
   * 内置内存泄漏防护机制
   */
  const fetchResourceDetail = useCallback(async (abortController?: AbortController) => {
    if (!slug) {
      setError('缺少资源标识符')
      setLoading(false)
      return
    }

    const controller = abortController || new AbortController()

    try {
      if (!controller.signal.aborted) {
        setLoading(true)
        setError(null)
      }

      // 获取主要资源信息
      const resourceData = getResourceBySlug(slug)
      
      if (!resourceData) {
        if (!controller.signal.aborted) {
          setResource(null)
          setComments([])
          setRelatedResources([])
          setRatingDistribution(null)
          setError('资源未找到')
        }
        return
      }

      // 检查是否已取消，避免在组件卸载后更新状态
      if (controller.signal.aborted) return

      // 设置资源数据
      setResource(resourceData)

      // 并行获取相关数据以提升性能
      const [commentsData, relatedData] = await Promise.allSettled([
        Promise.resolve(getResourceComments(resourceData.id)),
        Promise.resolve(getRelatedResources(resourceData.id, 3))
      ])

      // 再次检查是否已取消
      if (controller.signal.aborted) return

      // 处理评论数据
      if (commentsData.status === 'fulfilled') {
        setComments(commentsData.value)
      } else {
        // 只在开发环境输出警告
        if (process.env.NODE_ENV === 'development') {
          console.warn('获取评论失败:', commentsData.reason)
        }
        setComments([])
      }

      // 处理相关资源数据
      if (relatedData.status === 'fulfilled') {
        setRelatedResources(relatedData.value)
      } else {
        // 只在开发环境输出警告
        if (process.env.NODE_ENV === 'development') {
          console.warn('获取相关资源失败:', relatedData.reason)
        }
        setRelatedResources([])
      }

      // 设置评分分布（从资源数据中获取或生成默认值）
      const distribution = resourceData.ratingDistribution || {
        5: 0,
        4: 0, 
        3: 0,
        2: 0,
        1: 0
      }
      setRatingDistribution(distribution)

    } catch (err) {
      // 只在未取消的情况下设置错误状态
      if (!controller.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : '获取资源详情时出错'
        // 只在开发环境输出错误日志
        if (process.env.NODE_ENV === 'development') {
          console.error('获取资源详情失败:', err)
        }
        setError(errorMessage)
        
        // 重置状态
        setResource(null)
        setComments([])
        setRelatedResources([])
        setRatingDistribution(null)
      }
    } finally {
      // 只在未取消的情况下设置加载完成
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [slug])

  /**
   * 刷新数据
   * 重新获取所有资源相关数据
   */
  const refresh = useCallback(() => {
    fetchResourceDetail()
  }, [fetchResourceDetail])

  // 当 slug 变化时重新获取数据，包含内存泄漏防护
  useEffect(() => {
    const abortController = new AbortController()
    
    fetchResourceDetail(abortController)
    
    // 清理函数：组件卸载或依赖变化时取消正在进行的操作
    return () => {
      abortController.abort()
    }
  }, [fetchResourceDetail])

  return {
    // 数据
    resource,
    comments,
    relatedResources,
    ratingDistribution,
    
    // 状态
    loading,
    error,
    
    // 操作
    refresh
  }
}

