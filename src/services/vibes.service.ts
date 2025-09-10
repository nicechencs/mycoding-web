import { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
import { globalCache, CacheManager } from './base/cache-manager'
import { ApiResponse, QueryParams, PaginatedResponse } from './base/types'
import { Vibe, VibeComment } from '@/types'

// Mock数据导入（开发模式使用）
import {
  mockVibes,
  mockVibeComments,
  getLatestVibes,
  getVibeById,
  getVibesByUser,
  getVibeComments,
  getRelatedVibes,
} from '@/lib/mock/vibes'

/**
 * 动态服务接口
 */
export interface IVibesService {
  getVibes(params?: QueryParams): Promise<PaginatedResponse<Vibe>>
  getVibeById(id: string): Promise<ApiResponse<Vibe>>
  getLatestVibes(limit?: number): Promise<ApiResponse<Vibe[]>>
  getVibesByUser(
    userId: string,
    params?: QueryParams
  ): Promise<ApiResponse<Vibe[]>>
  getVibeComments(
    vibeId: string,
    params?: QueryParams
  ): Promise<ApiResponse<VibeComment[]>>
  getRelatedVibes(vibeId: string, limit?: number): Promise<ApiResponse<Vibe[]>>
  searchVibes(query: string, params?: QueryParams): Promise<ApiResponse<Vibe[]>>
  getVibesByTag(tag: string, params?: QueryParams): Promise<ApiResponse<Vibe[]>>
  getTrendingTags(): Promise<ApiResponse<string[]>>
}

/**
 * 动态服务实现
 * 支持开发模式（Mock数据）和生产模式（API调用）的环境适配
 */
export class VibesService implements IVibesService {
  private apiClient: ApiClient
  private cache: CacheManager

  constructor(apiClient: ApiClient = defaultApiClient) {
    this.apiClient = apiClient
    this.cache = globalCache
  }

  /**
   * 获取动态列表（支持分页、搜索、筛选）
   */
  async getVibes(params: QueryParams = {}): Promise<PaginatedResponse<Vibe>> {
    const cacheKey = CacheManager.generateKey('vibes:list', params)

    const cached = this.cache.get<PaginatedResponse<Vibe>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const result = this.mockGetVibes(params)
      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>('/vibes', { params })

      if (response.success && response.data) {
        const result: PaginatedResponse<Vibe> = {
          ...response,
          data: response.data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params.limit || 10)),
            hasNext:
              (params.page || 1) * (params.limit || 10) < response.data.length,
            hasPrev: (params.page || 1) > 1,
          },
        }

        this.cache.set(cacheKey, result)
        return result
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch vibes',
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }
  }

  /**
   * 根据ID获取单个动态
   */
  async getVibeById(id: string): Promise<ApiResponse<Vibe>> {
    const cacheKey = CacheManager.generateKey('vibes:detail', { id })

    const cached = this.cache.get<ApiResponse<Vibe>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const vibe = getVibeById(id)
      const result: ApiResponse<Vibe> = vibe
        ? { success: true, data: vibe }
        : { success: false, error: 'Vibe not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe>(`/vibes/${id}`)
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取最新动态
   */
  async getLatestVibes(limit: number = 10): Promise<ApiResponse<Vibe[]>> {
    const cacheKey = CacheManager.generateKey('vibes:latest', { limit })

    const cached = this.cache.get<ApiResponse<Vibe[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const vibes = getLatestVibes(limit)
      const result: ApiResponse<Vibe[]> = {
        success: true,
        data: vibes,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>('/vibes/latest', {
        params: { limit },
      })

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取指定用户的动态
   */
  async getVibesByUser(
    userId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Vibe[]>> {
    const cacheKey = CacheManager.generateKey('vibes:user', {
      userId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Vibe[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      let vibes = getVibesByUser(userId)

      // 应用搜索过滤
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        vibes = vibes.filter(
          vibe =>
            vibe.content.toLowerCase().includes(searchLower) ||
            vibe.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // 应用排序
      vibes.sort((a, b) => {
        if (params.sortBy === 'popular') {
          return b.likeCount - a.likeCount
        }
        // 默认按时间倒序
        return b.createdAt.getTime() - a.createdAt.getTime()
      })

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedVibes = vibes.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Vibe[]> = {
        success: true,
        data: paginatedVibes,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>(
        `/vibes/user/${userId}`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取动态评论
   */
  async getVibeComments(
    vibeId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<VibeComment[]>> {
    const cacheKey = CacheManager.generateKey('vibes:comments', {
      vibeId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<VibeComment[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const comments = getVibeComments(vibeId)
      const result: ApiResponse<VibeComment[]> = {
        success: true,
        data: comments,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<VibeComment[]>(
        `/vibes/${vibeId}/comments`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取相关动态
   */
  async getRelatedVibes(
    vibeId: string,
    limit: number = 5
  ): Promise<ApiResponse<Vibe[]>> {
    const cacheKey = CacheManager.generateKey('vibes:related', {
      vibeId,
      limit,
    })

    const cached = this.cache.get<ApiResponse<Vibe[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const vibes = getRelatedVibes(vibeId, limit)
      const result: ApiResponse<Vibe[]> = {
        success: true,
        data: vibes,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>(
        `/vibes/${vibeId}/related`,
        {
          params: { limit },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 搜索动态
   */
  async searchVibes(
    query: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Vibe[]>> {
    const cacheKey = CacheManager.generateKey('vibes:search', {
      query,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Vibe[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const searchLower = query.toLowerCase()
      let vibes = mockVibes.filter(
        vibe =>
          vibe.content.toLowerCase().includes(searchLower) ||
          vibe.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          vibe.author.name.toLowerCase().includes(searchLower)
      )

      // 应用排序
      if (params.sortBy === 'popular') {
        vibes.sort((a, b) => b.likeCount - a.likeCount)
      } else {
        // 默认按相关性和时间排序
        vibes.sort((a, b) => {
          // 计算相关性分数
          const aRelevance = this.calculateRelevance(a, searchLower)
          const bRelevance = this.calculateRelevance(b, searchLower)

          if (aRelevance !== bRelevance) {
            return bRelevance - aRelevance
          }

          // 相关性相同，按时间排序
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
      }

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedVibes = vibes.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Vibe[]> = {
        success: true,
        data: paginatedVibes,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>('/vibes/search', {
        params: { q: query, ...params },
      })

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 根据标签获取动态
   */
  async getVibesByTag(
    tag: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Vibe[]>> {
    const cacheKey = CacheManager.generateKey('vibes:tag', { tag, ...params })

    const cached = this.cache.get<ApiResponse<Vibe[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      let vibes = mockVibes.filter(vibe =>
        vibe.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      )

      // 应用排序
      if (params.sortBy === 'popular') {
        vibes.sort((a, b) => b.likeCount - a.likeCount)
      } else {
        vibes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      }

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedVibes = vibes.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Vibe[]> = {
        success: true,
        data: paginatedVibes,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Vibe[]>(
        `/vibes/tag/${encodeURIComponent(tag)}`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取热门标签
   */
  async getTrendingTags(): Promise<ApiResponse<string[]>> {
    const cacheKey = 'vibes:trending-tags'

    const cached = this.cache.get<ApiResponse<string[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 统计标签频率
      const tagCounts: { [key: string]: number } = {}
      mockVibes.forEach(vibe => {
        vibe.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })

      // 获取热门标签（按频率排序）
      const trendingTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag)

      const result: ApiResponse<string[]> = {
        success: true,
        data: trendingTags,
      }

      // 热门标签缓存时间短一些
      this.cache.set(cacheKey, result, { ttl: 2 * 60 * 1000 }) // 2分钟
      return result
    } else {
      const response = await this.apiClient.get<string[]>(
        '/vibes/trending-tags'
      )

      // 热门标签缓存时间短一些
      this.cache.set(cacheKey, response, { ttl: 2 * 60 * 1000 }) // 2分钟
      return response
    }
  }

  /**
   * Mock数据处理（开发模式）
   */
  private mockGetVibes(params: QueryParams): PaginatedResponse<Vibe> {
    let vibes = [...mockVibes]

    // 应用搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      vibes = vibes.filter(
        vibe =>
          vibe.content.toLowerCase().includes(searchLower) ||
          vibe.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          vibe.author.name.toLowerCase().includes(searchLower)
      )
    }

    // 应用标签过滤
    if (params.filters?.tags && params.filters.tags.length > 0) {
      vibes = vibes.filter(
        vibe =>
          params.filters?.tags?.some((tag: string) =>
            vibe.tags.some(
              vibeTag => vibeTag.toLowerCase() === tag.toLowerCase()
            )
          ) || false
      )
    }

    // 应用用户过滤
    if (params.filters?.author) {
      vibes = vibes.filter(vibe => vibe.author.id === params.filters?.author)
    }

    // 应用排序
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'popular':
          vibes.sort((a, b) => b.likeCount - a.likeCount)
          break
        case 'comments':
          vibes.sort((a, b) => b.commentCount - a.commentCount)
          break
        default:
          // 默认按时间倒序
          vibes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          break
      }
    } else {
      // 默认按时间倒序
      vibes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    // 应用分页
    const page = params.page || 1
    const limit = params.limit || 10
    const totalItems = vibes.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedVibes = vibes.slice(startIndex, startIndex + limit)

    return {
      success: true,
      data: paginatedVibes,
      pagination: {
        page,
        limit,
        total: totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }

  /**
   * 计算搜索相关性分数
   */
  private calculateRelevance(vibe: Vibe, searchQuery: string): number {
    let score = 0

    // 内容匹配（权重最高）
    const contentMatches = (
      vibe.content.toLowerCase().match(new RegExp(searchQuery, 'g')) || []
    ).length
    score += contentMatches * 3

    // 标签完全匹配
    const exactTagMatches = vibe.tags.filter(
      tag => tag.toLowerCase() === searchQuery
    ).length
    score += exactTagMatches * 2

    // 标签部分匹配
    const partialTagMatches = vibe.tags.filter(
      tag =>
        tag.toLowerCase().includes(searchQuery) &&
        tag.toLowerCase() !== searchQuery
    ).length
    score += partialTagMatches * 1

    // 作者名匹配
    if (vibe.author.name.toLowerCase().includes(searchQuery)) {
      score += 1
    }

    return score
  }
}

// 创建默认实例
export const vibesService = new VibesService()
