import { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
import { globalCache, CacheManager } from './base/cache-manager'
import { ApiResponse, QueryParams } from './base/types'
import { User } from '@/types'

// Mock数据导入（开发模式使用）
import { mockUsers, getCurrentUser } from '@/lib/mock/users'

/**
 * 用户更新数据接口
 */
export interface UserUpdateData {
  name?: string
  email?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  twitter?: string
  github?: string
  linkedin?: string
}

/**
 * 用户统计信息
 */
export interface UserStats {
  articlesCount: number
  resourcesCount: number
  vibesCount: number
  followersCount: number
  followingCount: number
  totalLikes: number
  totalViews: number
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  newsletter: boolean
  publicProfile: boolean
  showActivity: boolean
}

/**
 * 用户服务接口
 */
export interface IUsersService {
  getCurrentUser(): Promise<ApiResponse<User>>
  getUserById(id: string): Promise<ApiResponse<User>>
  getUserByEmail(email: string): Promise<ApiResponse<User>>
  updateUser(id: string, data: UserUpdateData): Promise<ApiResponse<User>>
  getUserStats(id: string): Promise<ApiResponse<UserStats>>
  getUserPreferences(id: string): Promise<ApiResponse<UserPreferences>>
  updateUserPreferences(
    id: string,
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>>
  searchUsers(query: string, params?: QueryParams): Promise<ApiResponse<User[]>>
  followUser(userId: string): Promise<ApiResponse<boolean>>
  unfollowUser(userId: string): Promise<ApiResponse<boolean>>
  getFollowers(
    userId: string,
    params?: QueryParams
  ): Promise<ApiResponse<User[]>>
  getFollowing(
    userId: string,
    params?: QueryParams
  ): Promise<ApiResponse<User[]>>
  isFollowing(userId: string): Promise<ApiResponse<boolean>>
  deleteUser(id: string): Promise<ApiResponse<boolean>>
}

/**
 * 用户服务实现
 * 支持开发模式（Mock数据）和生产模式（API调用）的环境适配
 */
export class UsersService implements IUsersService {
  private apiClient: ApiClient
  private cache: CacheManager

  constructor(apiClient: ApiClient = defaultApiClient) {
    this.apiClient = apiClient
    this.cache = globalCache
  }

  /**
   * 获取当前登录用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const cacheKey = 'users:current'

    const cached = this.cache.get<ApiResponse<User>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const user = getCurrentUser()
      const result: ApiResponse<User> = {
        success: true,
        data: user,
      }

      // 当前用户信息缓存时间短一些
      this.cache.set(cacheKey, result, { ttl: 2 * 60 * 1000 }) // 2分钟
      return result
    } else {
      const response = await this.apiClient.get<User>('/users/me')

      // 当前用户信息缓存时间短一些
      this.cache.set(cacheKey, response, { ttl: 2 * 60 * 1000 }) // 2分钟
      return response
    }
  }

  /**
   * 根据ID获取用户信息
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const cacheKey = CacheManager.generateKey('users:detail', { id })

    const cached = this.cache.get<ApiResponse<User>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const user = mockUsers.find(u => u.id === id)
      const result: ApiResponse<User> = user
        ? { success: true, data: user }
        : { success: false, error: 'User not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<User>(`/users/${id}`)
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 根据邮箱获取用户信息
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    const cacheKey = CacheManager.generateKey('users:email', { email })

    const cached = this.cache.get<ApiResponse<User>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const user = mockUsers.find(u => u.email === email)
      const result: ApiResponse<User> = user
        ? { success: true, data: user }
        : { success: false, error: 'User not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<User>(
        `/users/by-email/${encodeURIComponent(email)}`
      )
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(
    id: string,
    data: UserUpdateData
  ): Promise<ApiResponse<User>> {
    if (isDevelopment()) {
      // 在开发模式下模拟更新
      const userIndex = mockUsers.findIndex(u => u.id === id)
      if (userIndex === -1) {
        return { success: false, error: 'User not found' }
      }

      const updatedUser = {
        ...mockUsers[userIndex],
        ...data,
        updatedAt: new Date(),
      }

      // 更新mock数据（仅在当前会话有效）
      mockUsers[userIndex] = updatedUser

      // 清除相关缓存
      this.cache.delete(CacheManager.generateKey('users:detail', { id }))
      this.cache.delete('users:current')

      const result: ApiResponse<User> = {
        success: true,
        data: updatedUser,
      }

      return result
    } else {
      const response = await this.apiClient.put<User>(`/users/${id}`, data)

      if (response.success) {
        // 清除相关缓存
        this.cache.delete(CacheManager.generateKey('users:detail', { id }))
        this.cache.delete('users:current')
      }

      return response
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(id: string): Promise<ApiResponse<UserStats>> {
    const cacheKey = CacheManager.generateKey('users:stats', { id })

    const cached = this.cache.get<ApiResponse<UserStats>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 模拟统计数据
      const mockStats: UserStats = {
        articlesCount: Math.floor(Math.random() * 20) + 1,
        resourcesCount: Math.floor(Math.random() * 15) + 1,
        vibesCount: Math.floor(Math.random() * 50) + 5,
        followersCount: Math.floor(Math.random() * 100) + 10,
        followingCount: Math.floor(Math.random() * 80) + 5,
        totalLikes: Math.floor(Math.random() * 500) + 50,
        totalViews: Math.floor(Math.random() * 5000) + 500,
      }

      const result: ApiResponse<UserStats> = {
        success: true,
        data: mockStats,
      }

      this.cache.set(cacheKey, result, { ttl: 10 * 60 * 1000 }) // 10分钟缓存
      return result
    } else {
      const response = await this.apiClient.get<UserStats>(`/users/${id}/stats`)

      this.cache.set(cacheKey, response, { ttl: 10 * 60 * 1000 }) // 10分钟缓存
      return response
    }
  }

  /**
   * 获取用户偏好设置
   */
  async getUserPreferences(id: string): Promise<ApiResponse<UserPreferences>> {
    const cacheKey = CacheManager.generateKey('users:preferences', { id })

    const cached = this.cache.get<ApiResponse<UserPreferences>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 模拟偏好设置
      const mockPreferences: UserPreferences = {
        theme: 'system',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        emailNotifications: true,
        pushNotifications: false,
        newsletter: true,
        publicProfile: true,
        showActivity: true,
      }

      const result: ApiResponse<UserPreferences> = {
        success: true,
        data: mockPreferences,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<UserPreferences>(
        `/users/${id}/preferences`
      )
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 更新用户偏好设置
   */
  async updateUserPreferences(
    id: string,
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    if (isDevelopment()) {
      // 获取当前偏好设置
      const currentResponse = await this.getUserPreferences(id)
      if (!currentResponse.success || !currentResponse.data) {
        return { success: false, error: 'Failed to get current preferences' }
      }

      const updatedPreferences = {
        ...currentResponse.data,
        ...preferences,
      }

      // 清除缓存
      this.cache.delete(CacheManager.generateKey('users:preferences', { id }))

      const result: ApiResponse<UserPreferences> = {
        success: true,
        data: updatedPreferences,
      }

      return result
    } else {
      const response = await this.apiClient.patch<UserPreferences>(
        `/users/${id}/preferences`,
        preferences
      )

      if (response.success) {
        // 清除缓存
        this.cache.delete(CacheManager.generateKey('users:preferences', { id }))
      }

      return response
    }
  }

  /**
   * 搜索用户
   */
  async searchUsers(
    query: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<User[]>> {
    const cacheKey = CacheManager.generateKey('users:search', {
      query,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<User[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const searchLower = query.toLowerCase()
      let users = mockUsers.filter(
        user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedUsers = users.slice(startIndex, startIndex + limit)

      const result: ApiResponse<User[]> = {
        success: true,
        data: paginatedUsers,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<User[]>('/users/search', {
        params: { q: query, ...params },
      })

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 关注用户
   */
  async followUser(userId: string): Promise<ApiResponse<boolean>> {
    if (isDevelopment()) {
      // 模拟关注操作
      const result: ApiResponse<boolean> = {
        success: true,
        data: true,
      }

      // 清除相关缓存
      this.clearFollowCache(userId)

      return result
    } else {
      const response = await this.apiClient.post<boolean>(
        `/users/${userId}/follow`
      )

      if (response.success) {
        this.clearFollowCache(userId)
      }

      return response
    }
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: string): Promise<ApiResponse<boolean>> {
    if (isDevelopment()) {
      // 模拟取消关注操作
      const result: ApiResponse<boolean> = {
        success: true,
        data: true,
      }

      // 清除相关缓存
      this.clearFollowCache(userId)

      return result
    } else {
      const response = await this.apiClient.delete<boolean>(
        `/users/${userId}/follow`
      )

      if (response.success) {
        this.clearFollowCache(userId)
      }

      return response
    }
  }

  /**
   * 获取用户粉丝列表
   */
  async getFollowers(
    userId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<User[]>> {
    const cacheKey = CacheManager.generateKey('users:followers', {
      userId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<User[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 模拟粉丝数据
      const followers = mockUsers.slice(0, 3)

      const result: ApiResponse<User[]> = {
        success: true,
        data: followers,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<User[]>(
        `/users/${userId}/followers`,
        { params }
      )
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取用户关注列表
   */
  async getFollowing(
    userId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<User[]>> {
    const cacheKey = CacheManager.generateKey('users:following', {
      userId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<User[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 模拟关注数据
      const following = mockUsers.slice(1, 4)

      const result: ApiResponse<User[]> = {
        success: true,
        data: following,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<User[]>(
        `/users/${userId}/following`,
        { params }
      )
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 检查是否已关注某用户
   */
  async isFollowing(userId: string): Promise<ApiResponse<boolean>> {
    const cacheKey = CacheManager.generateKey('users:is-following', { userId })

    const cached = this.cache.get<ApiResponse<boolean>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 随机返回关注状态（模拟）
      const isFollowing = Math.random() > 0.5

      const result: ApiResponse<boolean> = {
        success: true,
        data: isFollowing,
      }

      this.cache.set(cacheKey, result, { ttl: 5 * 60 * 1000 }) // 5分钟缓存
      return result
    } else {
      const response = await this.apiClient.get<boolean>(
        `/users/${userId}/is-following`
      )
      this.cache.set(cacheKey, response, { ttl: 5 * 60 * 1000 }) // 5分钟缓存
      return response
    }
  }

  /**
   * 删除用户账户
   */
  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    if (isDevelopment()) {
      // 开发模式下不允许删除
      return {
        success: false,
        error: 'User deletion is not allowed in development mode',
      }
    } else {
      const response = await this.apiClient.delete<boolean>(`/users/${id}`)

      if (response.success) {
        // 清除所有相关缓存
        this.cache.delete(CacheManager.generateKey('users:detail', { id }))
        this.cache.delete('users:current')
        this.cache.delete(CacheManager.generateKey('users:stats', { id }))
        this.cache.delete(CacheManager.generateKey('users:preferences', { id }))
      }

      return response
    }
  }

  /**
   * 清除关注相关的缓存
   */
  private clearFollowCache(userId: string): void {
    this.cache.delete(
      CacheManager.generateKey('users:is-following', { userId })
    )
    this.cache.delete(CacheManager.generateKey('users:followers', { userId }))
    this.cache.delete(CacheManager.generateKey('users:following', { userId }))
    this.cache.delete(CacheManager.generateKey('users:stats', { id: userId }))
  }
}

// 创建默认实例
export const usersService = new UsersService()
