import useSWR from 'swr';
import { vibesService } from '@/services/vibes.service';
import { Vibe, VibeComment } from '@/types';
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
 * 获取动态列表
 */
export function useVibes(params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = ['vibes:list', params];
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getVibes(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟（动态更新比较频繁）
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取单个动态详情
 */
export function useVibe(id: string, options: SWROptions = {}) {
  const cacheKey = id ? ['vibes:detail', id] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getVibeById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 30 * 1000, // 30秒
      ...options,
    }
  );

  return {
    vibe: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取最新动态
 */
export function useLatestVibes(limit: number = 10, options: SWROptions = {}) {
  const cacheKey = ['vibes:latest', limit];
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getLatestVibes(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 1 * 60 * 1000, // 1分钟
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取指定用户的动态
 */
export function useVibesByUser(userId: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = userId ? ['vibes:user', userId, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getVibesByUser(userId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取动态评论
 */
export function useVibeComments(vibeId: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = vibeId ? ['vibes:comments', vibeId, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getVibeComments(vibeId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 15 * 1000, // 15秒（评论更新很频繁）
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
 * 获取相关动态
 */
export function useRelatedVibes(vibeId: string, limit: number = 5, options: SWROptions = {}) {
  const cacheKey = vibeId ? ['vibes:related', vibeId, limit] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getRelatedVibes(vibeId, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 搜索动态
 */
export function useSearchVibes(query: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = query ? ['vibes:search', query, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.searchVibes(query, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 1000, // 1秒内相同请求去重
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 根据标签获取动态
 */
export function useVibesByTag(tag: string, params: QueryParams = {}, options: SWROptions = {}) {
  const cacheKey = tag ? ['vibes:tag', tag, params] : null;
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getVibesByTag(tag, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  );

  return {
    vibes: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 获取热门标签
 */
export function useTrendingTags(options: SWROptions = {}) {
  const cacheKey = 'vibes:trending-tags';
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => vibesService.getTrendingTags(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  );

  return {
    tags: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  };
}

/**
 * 组合hook：获取动态详情及其相关数据
 */
export function useVibeDetail(vibeId: string, options: SWROptions = {}) {
  const {
    vibe,
    loading: vibeLoading,
    error: vibeError,
    mutate: mutateVibe,
  } = useVibe(vibeId, options);

  const {
    comments,
    loading: commentsLoading,
    mutate: mutateComments,
  } = useVibeComments(vibeId, {}, options);

  const {
    vibes: relatedVibes,
    loading: relatedLoading,
    mutate: mutateRelated,
  } = useRelatedVibes(vibeId, 5, options);

  return {
    vibe,
    comments,
    relatedVibes,
    loading: vibeLoading || commentsLoading || relatedLoading,
    error: vibeError,
    mutate: {
      vibe: mutateVibe,
      comments: mutateComments,
      related: mutateRelated,
    },
  };
}

/**
 * 实时动态流hook（用于首页等需要实时更新的场景）
 */
export function useVibeStream(params: QueryParams = {}, options: SWROptions = {}) {
  return useVibes(params, {
    refreshInterval: 30 * 1000, // 30秒自动刷新
    revalidateOnFocus: true, // 窗口获得焦点时刷新
    revalidateOnReconnect: true, // 网络重连时刷新
    ...options,
  });
}

/**
 * 用户个人动态流hook
 */
export function useUserVibeStream(userId: string, params: QueryParams = {}, options: SWROptions = {}) {
  return useVibesByUser(userId, params, {
    refreshInterval: 1 * 60 * 1000, // 1分钟
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  });
}

/**
 * 预加载动态数据的工具函数
 */
export function prefetchVibe(id: string) {
  return vibesService.getVibeById(id);
}

export function prefetchVibes(params: QueryParams = {}) {
  return vibesService.getVibes(params);
}

export function prefetchLatestVibes(limit: number = 10) {
  return vibesService.getLatestVibes(limit);
}

export function prefetchVibesByUser(userId: string, params: QueryParams = {}) {
  return vibesService.getVibesByUser(userId, params);
}