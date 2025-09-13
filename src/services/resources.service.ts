import { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
import { globalCache, CacheManager } from './base/cache-manager'
import { ApiResponse, QueryParams, PaginatedResponse } from './base/types'
import {
  Resource,
  ResourceComment,
  ResourceRating,
  ResourceRatingDistribution,
} from '@/types'

// Mock数据导入（开发模式使用）
import {
  mockResources,
  mockResourceCategories,
  mockResourceComments,
  mockResourceRatings,
  getResourcesByCategory,
  getFeaturedResources,
  getResourceById,
  getResourceBySlug,
  getResourceComments,
  getResourceRatings,
  getResourceRatingDistribution,
  getRelatedResources,
} from '@/lib/mock/resources'

/**
 * 资源服务接口
 */
export interface IResourcesService {
  getResources(params?: QueryParams): Promise<PaginatedResponse<Resource>>
  getResourceById(id: string): Promise<ApiResponse<Resource>>
  getResourceBySlug(slug: string): Promise<ApiResponse<Resource>>
  getFeaturedResources(limit?: number): Promise<ApiResponse<Resource[]>>
  getResourcesByCategory(
    category: string,
    params?: QueryParams
  ): Promise<ApiResponse<Resource[]>>
  getResourceComments(
    resourceId: string,
    params?: QueryParams
  ): Promise<ApiResponse<ResourceComment[]>>
  getResourceRatings(resourceId: string): Promise<ApiResponse<ResourceRating[]>>
  getResourceRatingDistribution(
    resourceId: string
  ): Promise<ApiResponse<ResourceRatingDistribution>>
  getRelatedResources(
    resourceId: string,
    limit?: number
  ): Promise<ApiResponse<Resource[]>>
  searchResources(
    query: string,
    params?: QueryParams
  ): Promise<ApiResponse<Resource[]>>
  getResourceCategories(): Promise<ApiResponse<any[]>>
}

/**
 * 资源服务实现
 * 支持开发模式（Mock数据）和生产模式（API调用）的环境适配
 */
export class ResourcesService implements IResourcesService {
  private apiClient: ApiClient
  private cache: CacheManager

  constructor(apiClient: ApiClient = defaultApiClient) {
    this.apiClient = apiClient
    this.cache = globalCache
  }

  /**
   * 获取资源列表（支持分页、搜索、筛选）
   */
  async getResources(
    params: QueryParams = {}
  ): Promise<PaginatedResponse<Resource>> {
    const cacheKey = CacheManager.generateKey('resources:list', params)

    const cached = this.cache.get<PaginatedResponse<Resource>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const result = this.mockGetResources(params)
      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource[]>('/resources', {
        params,
      })

      if (response.success && response.data) {
        const result: PaginatedResponse<Resource> = {
          ...response,
          data: response.data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 12,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params.limit || 12)),
            hasNext:
              (params.page || 1) * (params.limit || 12) < response.data.length,
            hasPrev: (params.page || 1) > 1,
          },
        }

        this.cache.set(cacheKey, result)
        return result
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch resources',
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }
  }

  /**
   * 根据ID获取资源详情
   */
  async getResourceById(id: string): Promise<ApiResponse<Resource>> {
    const cacheKey = CacheManager.generateKey('resources:detail', { id })

    const cached = this.cache.get<ApiResponse<Resource>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const resource = getResourceById(id)
      const result: ApiResponse<Resource> = resource
        ? { success: true, data: resource }
        : { success: false, error: 'Resource not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource>(`/resources/${id}`)
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 根据slug获取资源详情
   */
  async getResourceBySlug(slug: string): Promise<ApiResponse<Resource>> {
    const cacheKey = CacheManager.generateKey('resources:detail-slug', { slug })

    const cached = this.cache.get<ApiResponse<Resource>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const resource = getResourceBySlug(slug)
      const result: ApiResponse<Resource> = resource
        ? { success: true, data: resource }
        : { success: false, error: 'Resource not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource>(
        `/resources/slug/${slug}`
      )
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取精选资源
   */
  async getFeaturedResources(
    limit: number = 6
  ): Promise<ApiResponse<Resource[]>> {
    const cacheKey = CacheManager.generateKey('resources:featured', { limit })

    const cached = this.cache.get<ApiResponse<Resource[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const resources = getFeaturedResources().slice(0, limit)
      const result: ApiResponse<Resource[]> = {
        success: true,
        data: resources,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource[]>(
        '/resources/featured',
        {
          params: { limit },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 根据分类获取资源
   */
  async getResourcesByCategory(
    category: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Resource[]>> {
    const cacheKey = CacheManager.generateKey('resources:category', {
      category,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Resource[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      let resources = getResourcesByCategory(category)

      // 应用搜索过滤
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        resources = resources.filter(
          resource =>
            resource.title.toLowerCase().includes(searchLower) ||
            resource.description.toLowerCase().includes(searchLower) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // 应用评分过滤
      if (params.filters?.rating) {
        resources = resources.filter(
          resource => resource.rating >= (params.filters?.rating || 0)
        )
      }

      // 应用标签过滤
      if (params.filters?.tags && params.filters.tags.length > 0) {
        resources = resources.filter(
          resource =>
            params.filters?.tags?.some((tag: string) =>
              resource.tags.includes(tag)
            ) || false
        )
      }

      // 应用排序
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'latest':
            resources.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )
            break
          case 'popular':
            resources.sort((a, b) => b.viewCount - a.viewCount)
            break
          case 'rating':
            resources.sort((a, b) => b.rating - a.rating)
            break
          default:
            // 默认排序
            break
        }
      }

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 12
      const startIndex = (page - 1) * limit
      const paginatedResources = resources.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Resource[]> = {
        success: true,
        data: paginatedResources,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource[]>(
        `/resources/category/${category}`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取资源评论
   */
  async getResourceComments(
    resourceId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<ResourceComment[]>> {
    const cacheKey = CacheManager.generateKey('resources:comments', {
      resourceId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<ResourceComment[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const comments = getResourceComments(resourceId)
      const result: ApiResponse<ResourceComment[]> = {
        success: true,
        data: comments,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<ResourceComment[]>(
        `/resources/${resourceId}/comments`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取资源评分
   */
  async getResourceRatings(
    resourceId: string
  ): Promise<ApiResponse<ResourceRating[]>> {
    const cacheKey = CacheManager.generateKey('resources:ratings', {
      resourceId,
    })

    const cached = this.cache.get<ApiResponse<ResourceRating[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const ratings = getResourceRatings(resourceId)
      const result: ApiResponse<ResourceRating[]> = {
        success: true,
        data: ratings,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<ResourceRating[]>(
        `/resources/${resourceId}/ratings`
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取资源评分分布
   */
  async getResourceRatingDistribution(
    resourceId: string
  ): Promise<ApiResponse<ResourceRatingDistribution>> {
    const cacheKey = CacheManager.generateKey('resources:rating-distribution', {
      resourceId,
    })

    const cached =
      this.cache.get<ApiResponse<ResourceRatingDistribution>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const distribution = getResourceRatingDistribution(resourceId)
      const result: ApiResponse<ResourceRatingDistribution> = {
        success: true,
        data: distribution,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<ResourceRatingDistribution>(
        `/resources/${resourceId}/rating-distribution`
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取相关资源
   */
  async getRelatedResources(
    resourceId: string,
    limit: number = 4
  ): Promise<ApiResponse<Resource[]>> {
    const cacheKey = CacheManager.generateKey('resources:related', {
      resourceId,
      limit,
    })

    const cached = this.cache.get<ApiResponse<Resource[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const resources = getRelatedResources(resourceId, limit)
      const result: ApiResponse<Resource[]> = {
        success: true,
        data: resources,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource[]>(
        `/resources/${resourceId}/related`,
        {
          params: { limit },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 搜索资源
   */
  async searchResources(
    query: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Resource[]>> {
    const cacheKey = CacheManager.generateKey('resources:search', {
      query,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Resource[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const searchLower = query.toLowerCase()
      const resources = mockResources.filter(
        resource =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          (resource.detailedDescription &&
            resource.detailedDescription.toLowerCase().includes(searchLower)) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          resource.author.toLowerCase().includes(searchLower)
      )

      // 应用排序
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'latest':
            resources.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )
            break
          case 'popular':
            resources.sort((a, b) => b.viewCount - a.viewCount)
            break
          case 'rating':
            resources.sort((a, b) => b.rating - a.rating)
            break
        }
      }

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 12
      const startIndex = (page - 1) * limit
      const paginatedResources = resources.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Resource[]> = {
        success: true,
        data: paginatedResources,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Resource[]>(
        '/resources/search',
        {
          params: { q: query, ...params },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取资源分类
   */
  async getResourceCategories(): Promise<ApiResponse<any[]>> {
    const cacheKey = 'resources:categories'

    const cached = this.cache.get<ApiResponse<any[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const result: ApiResponse<any[]> = {
        success: true,
        data: mockResourceCategories,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<any[]>('/resources/categories')

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * Mock数据处理（开发模式）
   */
  private mockGetResources(params: QueryParams): PaginatedResponse<Resource> {
    let resources = [...mockResources]

    // 应用搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      resources = resources.filter(
        resource =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // 应用分类过滤
    if (params.filters?.category && params.filters.category !== 'all') {
      resources = resources.filter(
        resource => resource.category === params.filters?.category
      )
    }

    // 应用评分过滤
    if (params.filters?.rating) {
      resources = resources.filter(
        resource => resource.rating >= (params.filters?.rating || 0)
      )
    }

    // 应用标签过滤
    if (params.filters?.tags && params.filters.tags.length > 0) {
      resources = resources.filter(
        resource =>
          params.filters?.tags?.some((tag: string) =>
            resource.tags.includes(tag)
          ) || false
      )
    }

    // 应用排序
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'latest':
          resources.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
          break
        case 'popular':
          resources.sort((a, b) => b.viewCount - a.viewCount)
          break
        case 'rating':
          resources.sort((a, b) => b.rating - a.rating)
          break
        default:
          // 默认按评分排序
          resources.sort((a, b) => b.rating - a.rating)
          break
      }
    } else {
      // 默认按评分排序
      resources.sort((a, b) => b.rating - a.rating)
    }

    // 应用分页
    const page = params.page || 1
    const limit = params.limit || 12
    const totalItems = resources.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedResources = resources.slice(startIndex, startIndex + limit)

    return {
      success: true,
      data: paginatedResources,
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
}

// 创建默认实例
export const resourcesService = new ResourcesService()
