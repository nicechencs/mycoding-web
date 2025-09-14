import { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
import { globalCache, CacheManager } from './base/cache-manager'
import { ApiResponse, QueryParams, PaginatedResponse } from './base/types'
import { Article, Comment } from '@/types'
import { CreateArticleRequest, UpdateArticleRequest, ArticleDraft } from '@/types/article'

// Mock数据导入（开发模式使用）
import {
  mockArticles,
  mockArticleComments,
  getFeaturedArticles,
  getArticlesByCategory,
  getArticleBySlug,
  getLatestArticles,
  getArticleComments,
  getRelatedArticles,
} from '@/lib/mock/articles'

// Mock草稿存储（开发模式使用）
const mockDrafts: ArticleDraft[] = []

/**
 * 文章服务接口
 */
export interface IArticlesService {
  getArticles(params?: QueryParams): Promise<PaginatedResponse<Article>>
  getArticleBySlug(slug: string): Promise<ApiResponse<Article>>
  getFeaturedArticles(limit?: number): Promise<ApiResponse<Article[]>>
  getArticlesByCategory(
    category: string,
    params?: QueryParams
  ): Promise<ApiResponse<Article[]>>
  getLatestArticles(limit?: number): Promise<ApiResponse<Article[]>>
  getArticleComments(
    articleId: string,
    params?: QueryParams
  ): Promise<ApiResponse<Comment[]>>
  getRelatedArticles(
    slug: string,
    limit?: number
  ): Promise<ApiResponse<Article[]>>
  searchArticles(
    query: string,
    params?: QueryParams
  ): Promise<ApiResponse<Article[]>>
  createArticle(data: CreateArticleRequest): Promise<ApiResponse<Article>>
  updateArticle(
    id: string,
    data: UpdateArticleRequest
  ): Promise<ApiResponse<Article>>
  deleteArticle(id: string): Promise<ApiResponse<void>>
  getDrafts(): Promise<ApiResponse<ArticleDraft[]>>
}

/**
 * 文章服务实现
 * 支持开发模式（Mock数据）和生产模式（API调用）的环境适配
 */
export class ArticlesService implements IArticlesService {
  private apiClient: ApiClient
  private cache: CacheManager

  constructor(apiClient: ApiClient = defaultApiClient) {
    this.apiClient = apiClient
    this.cache = globalCache
  }

  /**
   * 获取文章列表（支持分页、搜索、筛选）
   */
  async getArticles(
    params: QueryParams = {}
  ): Promise<PaginatedResponse<Article>> {
    const cacheKey = CacheManager.generateKey('articles:list', params)

    // 尝试从缓存获取
    const cached = this.cache.get<PaginatedResponse<Article>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      // 开发模式：使用Mock数据
      const result = this.mockGetArticles(params)
      this.cache.set(cacheKey, result)
      return result
    } else {
      // 生产模式：调用API
      const response = await this.apiClient.get<Article[]>('/articles', {
        params,
      })

      if (response.success && response.data) {
        const result: PaginatedResponse<Article> = {
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
        error: response.error || 'Failed to fetch articles',
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
   * 根据slug获取单篇文章
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    const cacheKey = CacheManager.generateKey('articles:detail', { slug })

    const cached = this.cache.get<ApiResponse<Article>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const article = getArticleBySlug(slug)
      const result: ApiResponse<Article> = article
        ? { success: true, data: article }
        : { success: false, error: 'Article not found' }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article>(`/articles/${slug}`)
      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取精选文章
   */
  async getFeaturedArticles(
    limit: number = 6
  ): Promise<ApiResponse<Article[]>> {
    const cacheKey = CacheManager.generateKey('articles:featured', { limit })

    const cached = this.cache.get<ApiResponse<Article[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const articles = getFeaturedArticles().slice(0, limit)
      const result: ApiResponse<Article[]> = {
        success: true,
        data: articles,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article[]>(
        '/articles/featured',
        {
          params: { limit },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 根据分类获取文章
   */
  async getArticlesByCategory(
    category: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Article[]>> {
    const cacheKey = CacheManager.generateKey('articles:category', {
      category,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Article[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      let articles = getArticlesByCategory(category)

      // 应用搜索过滤
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        articles = articles.filter(
          article =>
            article.title.toLowerCase().includes(searchLower) ||
            article.excerpt.toLowerCase().includes(searchLower) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedArticles = articles.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Article[]> = {
        success: true,
        data: paginatedArticles,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article[]>(
        `/articles/category/${category}`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取最新文章
   */
  async getLatestArticles(limit: number = 6): Promise<ApiResponse<Article[]>> {
    const cacheKey = CacheManager.generateKey('articles:latest', { limit })

    const cached = this.cache.get<ApiResponse<Article[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const articles = getLatestArticles(limit)
      const result: ApiResponse<Article[]> = {
        success: true,
        data: articles,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article[]>('/articles/latest', {
        params: { limit },
      })

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取文章评论
   */
  async getArticleComments(
    articleId: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Comment[]>> {
    const cacheKey = CacheManager.generateKey('articles:comments', {
      articleId,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Comment[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const comments = getArticleComments(articleId)
      const result: ApiResponse<Comment[]> = {
        success: true,
        data: comments,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Comment[]>(
        `/articles/${articleId}/comments`,
        {
          params,
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 获取相关文章
   */
  async getRelatedArticles(
    slug: string,
    limit: number = 3
  ): Promise<ApiResponse<Article[]>> {
    const cacheKey = CacheManager.generateKey('articles:related', {
      slug,
      limit,
    })

    const cached = this.cache.get<ApiResponse<Article[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const articles = getRelatedArticles(slug, limit)
      const result: ApiResponse<Article[]> = {
        success: true,
        data: articles,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article[]>(
        `/articles/${slug}/related`,
        {
          params: { limit },
        }
      )

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 搜索文章
   */
  async searchArticles(
    query: string,
    params: QueryParams = {}
  ): Promise<ApiResponse<Article[]>> {
    const cacheKey = CacheManager.generateKey('articles:search', {
      query,
      ...params,
    })

    const cached = this.cache.get<ApiResponse<Article[]>>(cacheKey)
    if (cached) {
      return cached
    }

    if (isDevelopment()) {
      const searchLower = query.toLowerCase()
      const articles = mockArticles.filter(
        article =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )

      // 应用分页
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const paginatedArticles = articles.slice(startIndex, startIndex + limit)

      const result: ApiResponse<Article[]> = {
        success: true,
        data: paginatedArticles,
      }

      this.cache.set(cacheKey, result)
      return result
    } else {
      const response = await this.apiClient.get<Article[]>('/articles/search', {
        params: { q: query, ...params },
      })

      this.cache.set(cacheKey, response)
      return response
    }
  }

  /**
   * 创建文章
   */
  async createArticle(
    data: CreateArticleRequest
  ): Promise<ApiResponse<Article>> {
    if (isDevelopment()) {
      // 生成URL友好的slug（处理中文）
      const generateSlug = (title: string): string => {
        const timestamp = Date.now().toString(36)
        const randomStr = Math.random().toString(36).substring(2, 5)
        return `article-${timestamp}-${randomStr}`
      }

      // 获取当前用户信息（从localStorage模拟）
      const currentUser = {
        id: 'user-1',
        name: localStorage.getItem('userName') || 'Test User',
        email: localStorage.getItem('userEmail') || 'test@example.com',
        avatar: localStorage.getItem('userAvatar') || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // 模拟创建文章
      const newArticle: Article = {
        id: `article-${Date.now()}`,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: generateSlug(data.title),
        author: currentUser,
        category: data.category,
        tags: data.tags,
        coverImage: data.coverImage,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false
      }

      if (data.isDraft) {
        // 保存为草稿
        const draft: ArticleDraft = {
          ...newArticle,
          isDraft: true
        }
        mockDrafts.push(draft)
      } else {
        // 发布文章
        mockArticles.unshift(newArticle)
      }

      // 清除相关缓存
      this.cache.clear()

      return {
        success: true,
        data: newArticle,
        message: data.isDraft ? '草稿保存成功' : '文章发布成功'
      }
    } else {
      const response = await this.apiClient.post<Article>('/articles', data)
      if (response.success) {
        this.cache.clear()
      }
      return response
    }
  }

  /**
   * 更新文章
   */
  async updateArticle(
    id: string,
    data: UpdateArticleRequest
  ): Promise<ApiResponse<Article>> {
    if (isDevelopment()) {
      const articleIndex = mockArticles.findIndex(a => a.id === id)
      if (articleIndex === -1) {
        return {
          success: false,
          error: '文章不存在'
        }
      }

      const updatedArticle = {
        ...mockArticles[articleIndex],
        ...data,
        updatedAt: new Date()
      }

      mockArticles[articleIndex] = updatedArticle

      // 清除相关缓存
      this.cache.clear()

      return {
        success: true,
        data: updatedArticle,
        message: '文章更新成功'
      }
    } else {
      const response = await this.apiClient.put<Article>(`/articles/${id}`, data)
      if (response.success) {
        this.cache.clear()
      }
      return response
    }
  }

  /**
   * 删除文章
   */
  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    if (isDevelopment()) {
      const articleIndex = mockArticles.findIndex(a => a.id === id)
      if (articleIndex === -1) {
        return {
          success: false,
          error: '文章不存在'
        }
      }

      mockArticles.splice(articleIndex, 1)

      // 清除相关缓存
      this.cache.clear()

      return {
        success: true,
        message: '文章删除成功'
      }
    } else {
      const response = await this.apiClient.delete<void>(`/articles/${id}`)
      if (response.success) {
        this.cache.clear()
      }
      return response
    }
  }

  /**
   * 获取草稿列表
   */
  async getDrafts(): Promise<ApiResponse<ArticleDraft[]>> {
    if (isDevelopment()) {
      return {
        success: true,
        data: mockDrafts,
      }
    } else {
      const response = await this.apiClient.get<ArticleDraft[]>('/articles/drafts')
      return response
    }
  }

  /**
   * Mock数据处理（开发模式）
   */
  private mockGetArticles(params: QueryParams): PaginatedResponse<Article> {
    let articles = [...mockArticles]

    // 应用搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      articles = articles.filter(
        article =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // 应用分类过滤
    if (params.filters?.category && params.filters.category !== 'all') {
      articles = articles.filter(
        article => article.category === params.filters?.category
      )
    }

    // 应用排序
    if (params.sortBy) {
      articles.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Article] as any
        const bValue = b[params.sortBy as keyof Article] as any

        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1
        }
        return aValue > bValue ? 1 : -1
      })
    } else {
      // 默认按创建时间倒序
      articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    // 应用分页
    const page = params.page || 1
    const limit = params.limit || 10
    const totalItems = articles.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedArticles = articles.slice(startIndex, startIndex + limit)

    return {
      success: true,
      data: paginatedArticles,
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
export const articlesService = new ArticlesService()
