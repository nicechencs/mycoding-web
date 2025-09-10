// 这个文件已被弃用，请使用 use-resources.ts 中的 useResourceDetail Hook 代替
// @deprecated Use useResourceDetail from '@/hooks/use-resources' instead

import { 
  useResourceBySlug, 
  useResourceComments, 
  useResourceRatingDistribution, 
  useRelatedResources 
} from './use-resources'
import type {
  Resource,
  ResourceComment,
  ResourceRatingDistribution,
} from '@/types/resource'

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
 * @deprecated 此 Hook 已被弃用，请使用 `useResourceDetail` from '@/hooks/use-resources' 代替
 * 新的 Hook 基于 SWR，提供更好的缓存和性能
 *
 * 提供统一的数据获取、状态管理和错误处理功能
 *
 * @param slug 资源的 slug 标识符
 * @returns UseResourceDetailReturn 包含数据和操作方法的对象
 *
 * @example
 * ```tsx
 * // 旧版本 (已弃用)
 * const { resource, comments, loading, error, refresh } = useResourceDetail(slug)
 *
 * // 新版本 (推荐)
 * import { useResourceDetail } from '@/hooks/use-resources'
 * const { resource, comments, ratingDistribution, relatedResources, loading, error, mutate } = useResourceDetail(resourceId)
 * ```
 */
export function useResourceDetail(slug: string): UseResourceDetailReturn {
  console.warn(
    'useResourceDetail from use-resource-detail.ts is deprecated. ' +
    'Please use useResourceDetail from use-resources.ts instead for better performance and caching.'
  )

  // 通过 slug 获取资源
  const { resource, loading: resourceLoading, error: resourceError } = useResourceBySlug(slug)
  
  // 获取资源相关数据
  const resourceId = resource?.id || ''
  
  const { 
    comments, 
    loading: commentsLoading, 
    mutate: mutateComments 
  } = useResourceComments(resourceId)
  
  const { 
    distribution: ratingDistribution, 
    loading: distributionLoading, 
    mutate: mutateDistribution 
  } = useResourceRatingDistribution(resourceId)
  
  const { 
    resources: relatedResources, 
    loading: relatedLoading, 
    mutate: mutateRelated 
  } = useRelatedResources(resourceId, 3)

  const loading = resourceLoading || commentsLoading || distributionLoading || relatedLoading
  const error = resourceError

  const refresh = () => {
    mutateComments()
    mutateDistribution()
    mutateRelated()
  }

  return {
    // 数据
    resource,
    comments: comments || [],
    relatedResources: relatedResources || [],
    ratingDistribution,

    // 状态
    loading,
    error,

    // 操作
    refresh,
  }
}
