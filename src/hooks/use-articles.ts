import useSWR from 'swr'
import { articlesService } from '@/services/articles.service'
import { Article, Comment } from '@/types'
import {
  QueryParams,
  ApiResponse,
  PaginatedResponse,
} from '@/services/base/types'

/**
 * SWR配置选项
 */
interface SWROptions {
  refreshInterval?: number
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  errorRetryCount?: number
  suspense?: boolean
}

/**
 * 获取文章列表
 */
export function useArticles(
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = ['articles:list', params]

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getArticles(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取单篇文章详情
 */
export function useArticle(slug: string, options: SWROptions = {}) {
  const cacheKey = slug ? ['articles:detail', slug] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getArticleBySlug(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      ...options,
    }
  )

  return {
    article: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取精选文章
 */
export function useFeaturedArticles(
  limit: number = 6,
  options: SWROptions = {}
) {
  const cacheKey = ['articles:featured', limit]

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getFeaturedArticles(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取分类文章
 */
export function useArticlesByCategory(
  category: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = category ? ['articles:category', category, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getArticlesByCategory(category, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取最新文章
 */
export function useLatestArticles(limit: number = 6, options: SWROptions = {}) {
  const cacheKey = ['articles:latest', limit]

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getLatestArticles(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取文章评论
 */
export function useArticleComments(
  articleId: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = articleId ? ['articles:comments', articleId, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getArticleComments(articleId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 30 * 1000, // 30秒（评论更新频繁）
      ...options,
    }
  )

  return {
    comments: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取相关文章
 */
export function useRelatedArticles(
  slug: string,
  limit: number = 3,
  options: SWROptions = {}
) {
  const cacheKey = slug ? ['articles:related', slug, limit] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.getRelatedArticles(slug, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 搜索文章
 */
export function useSearchArticles(
  query: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = query ? ['articles:search', query, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => articlesService.searchArticles(query, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 1000, // 1秒内相同请求去重
      ...options,
    }
  )

  return {
    articles: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 预加载文章数据的工具函数
 */
export function prefetchArticle(slug: string) {
  return articlesService.getArticleBySlug(slug)
}

export function prefetchArticles(params: QueryParams = {}) {
  return articlesService.getArticles(params)
}

export function prefetchFeaturedArticles(limit: number = 6) {
  return articlesService.getFeaturedArticles(limit)
}
