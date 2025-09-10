import useSWR from 'swr';
import { resourcesService } from '@/services/resources.service';
import { Resource, ResourceComment, ResourceRating, ResourceRatingDistribution } from '@/types';
import { QueryParams, ApiResponse, PaginatedResponse } from '@/services/base/types';

/**
 * SWR配置选项
 */
interface SWROptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  errorRetryCount?: number;
  suspense?: boolean;
}

/**
 * 获取资源列表
 */
export function useResources(params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = ['resources:list', params];
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResources(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  );

  return {
    resources: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 根据ID获取资源详情
 */
export function useResource(id: string, options: SWROptions = {}) {
  const cacheKey = id ? ['resources:detail', id] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      ...options,
    }
  );

  return {
    resource: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 根据slug获取资源详情
 */
export function useResourceBySlug(slug: string, options: SWROptions = {}) {
  const cacheKey = slug ? ['resources:detail-slug', slug] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceBySlug(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      ...options,
    }
  );

  return {
    resource: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取精选资源
 */
export function useFeaturedResources(limit: number = 6, options: SWROptions = {}) {
  const cacheKey = ['resources:featured', limit];
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getFeaturedResources(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  );

  return {
    resources: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 根据分类获取资源
 */
export function useResourcesByCategory(category: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = category ? ['resources:category', category, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourcesByCategory(category, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  );

  return {
    resources: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取资源评论
 */
export function useResourceComments(resourceId: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = resourceId ? ['resources:comments', resourceId, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceComments(resourceId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 30 * 1000, // 30秒
      ...options,
    }
  );

  return {
    comments: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取资源评分
 */
export function useResourceRatings(resourceId: string, options: SWROptions = {}) {
  const cacheKey = resourceId ? ['resources:ratings', resourceId] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceRatings(resourceId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  );

  return {
    ratings: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取资源评分分布
 */
export function useResourceRatingDistribution(resourceId: string, options: SWROptions = {}) {
  const cacheKey = resourceId ? ['resources:rating-distribution', resourceId] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceRatingDistribution(resourceId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  );

  return {
    distribution: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取相关资源
 */
export function useRelatedResources(resourceId: string, limit: number = 4, options: SWROptions = {}) {
  const cacheKey = resourceId ? ['resources:related', resourceId, limit] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getRelatedResources(resourceId, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  );

  return {
    resources: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 搜索资源
 */
export function useSearchResources(query: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = query ? ['resources:search', query, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.searchResources(query, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 1000, // 1秒内相同请求去重
      ...options,
    }
  );

  return {
    resources: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取资源分类
 */
export function useResourceCategories(options: SWROptions = {}) {
  const cacheKey = 'resources:categories';
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => resourcesService.getResourceCategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 30 * 60 * 1000, // 30分钟（分类不经常变化）
      ...options,
    }
  );

  return {
    categories: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 组合hook：获取资源详情及其相关数据
 */
export function useResourceDetail(resourceId: string, options: SWROptions = {}) {
  const {
    resource,
    loading: resourceLoading,
    error: resourceError,
    mutate: mutateResource,
  } = useResource(resourceId, options);

  const {
    comments,
    loading: commentsLoading,
    mutate: mutateComments,
  } = useResourceComments(resourceId, {}, options);

  const {
    distribution,
    loading: distributionLoading,
    mutate: mutateDistribution,
  } = useResourceRatingDistribution(resourceId, options);

  const {
    resources: relatedResources,
    loading: relatedLoading,
    mutate: mutateRelated,
  } = useRelatedResources(resourceId, 4, options);

  return {
    resource,
    comments,
    ratingDistribution: distribution,
    relatedResources,
    loading: resourceLoading || commentsLoading || distributionLoading || relatedLoading,
    error: resourceError,
    mutate: {
      resource: mutateResource,
      comments: mutateComments,
      distribution: mutateDistribution,
      related: mutateRelated,
    },
  };
}

/**
 * 预加载资源数据的工具函数
 */
export function prefetchResource(id: string) {
  return resourcesService.getResourceById(id);
}

export function prefetchResourceBySlug(slug: string) {
  return resourcesService.getResourceBySlug(slug);
}

export function prefetchResources(params: QueryParams = {}) {
  return resourcesService.getResources(params);
}

export function prefetchFeaturedResources(limit: number = 6) {
  return resourcesService.getFeaturedResources(limit);
}