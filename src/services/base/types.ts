// 基础服务类型定义

/** HTTP 方法类型 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/** 环境类型 */
export type Environment = 'development' | 'production' | 'test'

/** API 响应基础类型 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp?: string
}

/** 分页参数类型 */
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

/** 分页响应类型 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/** 排序参数类型 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** 查询参数类型 */
export interface QueryParams extends PaginationParams, SortParams {
  search?: string
  filters?: Record<string, any>
  [key: string]: any
}

/** HTTP 请求配置 */
export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  baseURL?: string
  params?: Record<string, any>
  data?: any
}

/** API 错误类型 */
export interface ApiError {
  code: string | number
  message: string
  details?: any
  timestamp?: string
}

/** 缓存配置类型 */
export interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  maxSize?: number
  enabled?: boolean
}

/** 服务配置类型 */
export interface ServiceConfig {
  baseURL: string
  timeout: number
  retryCount: number
  cache: CacheConfig
  environment: Environment
  enableLogging: boolean
}

/** 请求拦截器类型 */
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>

/** 响应拦截器类型 */
export type ResponseInterceptor<T = any> = (
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>

/** 错误拦截器类型 */
export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>

/** 拦截器配置 */
export interface InterceptorConfig {
  request?: RequestInterceptor[]
  response?: ResponseInterceptor[]
  error?: ErrorInterceptor[]
}

/** 缓存项类型 */
export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

/** 缓存操作选项 */
export interface CacheOptions {
  ttl?: number
  forceRefresh?: boolean
  skipCache?: boolean
}
