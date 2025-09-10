import useSWR from 'swr'
import {
  usersService,
  UserUpdateData,
  UserStats,
  UserPreferences,
} from '@/services/users.service'
import { User } from '@/types'
import { QueryParams, ApiResponse } from '@/services/base/types'

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
 * 获取当前登录用户信息
 */
export function useCurrentUser(options: SWROptions = {}) {
  const cacheKey = 'users:current'

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getCurrentUser(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    user: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 根据ID获取用户信息
 */
export function useUser(id: string, options: SWROptions = {}) {
  const cacheKey = id ? ['users:detail', id] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getUserById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  )

  return {
    user: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 根据邮箱获取用户信息
 */
export function useUserByEmail(email: string, options: SWROptions = {}) {
  const cacheKey = email ? ['users:email', email] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getUserByEmail(email),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 10 * 60 * 1000, // 10分钟
      ...options,
    }
  )

  return {
    user: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取用户统计信息
 */
export function useUserStats(id: string, options: SWROptions = {}) {
  const cacheKey = id ? ['users:stats', id] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getUserStats(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    stats: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取用户偏好设置
 */
export function useUserPreferences(id: string, options: SWROptions = {}) {
  const cacheKey = id ? ['users:preferences', id] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getUserPreferences(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 30 * 60 * 1000, // 30分钟（偏好设置不经常变化）
      ...options,
    }
  )

  return {
    preferences: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 搜索用户
 */
export function useSearchUsers(
  query: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = query ? ['users:search', query, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.searchUsers(query, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 1000, // 1秒内相同请求去重
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    users: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取用户关注列表
 */
export function useUserFollowing(
  userId: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = userId ? ['users:following', userId, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getFollowing(userId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    following: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 获取用户粉丝列表
 */
export function useUserFollowers(
  userId: string,
  params: QueryParams = {},
  options: SWROptions = {}
) {
  const cacheKey = userId ? ['users:followers', userId, params] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.getFollowers(userId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 5 * 60 * 1000, // 5分钟
      ...options,
    }
  )

  return {
    followers: data?.data || [],
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 检查是否已关注某用户
 */
export function useIsFollowing(userId: string, options: SWROptions = {}) {
  const cacheKey = userId ? ['users:is-following', userId] : null

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    cacheKey,
    () => usersService.isFollowing(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      refreshInterval: 2 * 60 * 1000, // 2分钟
      ...options,
    }
  )

  return {
    isFollowing: data?.data,
    loading: isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
    isValidating,
  }
}

/**
 * 组合hook：获取用户完整资料
 */
export function useUserProfile(userId: string, options: SWROptions = {}) {
  const {
    user,
    loading: userLoading,
    error: userError,
    mutate: mutateUser,
  } = useUser(userId, options)

  const {
    stats,
    loading: statsLoading,
    mutate: mutateStats,
  } = useUserStats(userId, options)

  const {
    isFollowing,
    loading: followLoading,
    mutate: mutateFollow,
  } = useIsFollowing(userId, options)

  return {
    user,
    stats,
    isFollowing,
    loading: userLoading || statsLoading || followLoading,
    error: userError,
    mutate: {
      user: mutateUser,
      stats: mutateStats,
      follow: mutateFollow,
    },
  }
}

/**
 * 用户操作hooks（带乐观更新）
 */
export function useUserActions() {
  /**
   * 更新用户信息
   */
  const updateUser = async (id: string, data: UserUpdateData) => {
    try {
      const result = await usersService.updateUser(id, data)
      if (result.success) {
        // 触发相关数据的重新获取
        // 这里可以使用SWR的mutate来更新缓存
      }
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 更新用户偏好设置
   */
  const updatePreferences = async (
    id: string,
    preferences: Partial<UserPreferences>
  ) => {
    try {
      const result = await usersService.updateUserPreferences(id, preferences)
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 关注用户（乐观更新）
   */
  const followUser = async (userId: string) => {
    try {
      // 乐观更新：立即更新UI
      const followCache = ['users:is-following', userId]
      // mutate(followCache, true, false); // 立即更新为true，但不重新验证

      const result = await usersService.followUser(userId)

      if (!result.success) {
        // 如果失败，回滚乐观更新
        // mutate(followCache);
        throw new Error(result.error || 'Failed to follow user')
      }

      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 取消关注用户（乐观更新）
   */
  const unfollowUser = async (userId: string) => {
    try {
      // 乐观更新：立即更新UI
      const followCache = ['users:is-following', userId]
      // mutate(followCache, false, false); // 立即更新为false，但不重新验证

      const result = await usersService.unfollowUser(userId)

      if (!result.success) {
        // 如果失败，回滚乐观更新
        // mutate(followCache);
        throw new Error(result.error || 'Failed to unfollow user')
      }

      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 删除用户账户
   */
  const deleteUser = async (id: string) => {
    try {
      const result = await usersService.deleteUser(id)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    updateUser,
    updatePreferences,
    followUser,
    unfollowUser,
    deleteUser,
  }
}

/**
 * 当前用户的完整信息hook
 */
export function useCurrentUserProfile(options: SWROptions = {}) {
  const {
    user,
    loading: userLoading,
    error: userError,
    mutate: mutateUser,
  } = useCurrentUser(options)

  const {
    stats,
    loading: statsLoading,
    mutate: mutateStats,
  } = useUserStats(user?.id || '', { ...options, ...{ suspense: false } })

  const {
    preferences,
    loading: preferencesLoading,
    mutate: mutatePreferences,
  } = useUserPreferences(user?.id || '', { ...options, ...{ suspense: false } })

  return {
    user,
    stats,
    preferences,
    loading: userLoading || (user ? statsLoading || preferencesLoading : false),
    error: userError,
    mutate: {
      user: mutateUser,
      stats: mutateStats,
      preferences: mutatePreferences,
    },
  }
}

/**
 * 预加载用户数据的工具函数
 */
export function prefetchUser(id: string) {
  return usersService.getUserById(id)
}

export function prefetchCurrentUser() {
  return usersService.getCurrentUser()
}

export function prefetchUserStats(id: string) {
  return usersService.getUserStats(id)
}
