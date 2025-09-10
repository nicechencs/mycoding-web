import {
  ApiResponse,
  ApiError,
  HttpMethod,
  RequestConfig,
  ServiceConfig,
  InterceptorConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './types'

/**
 * 基础API客户端
 * 提供HTTP请求封装、拦截器和错误处理
 */
export class ApiClient {
  private config: ServiceConfig
  private interceptors: InterceptorConfig = {
    request: [],
    response: [],
    error: [],
  }

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      retryCount: 3,
      environment: (process.env.NODE_ENV as any) || 'development',
      enableLogging: process.env.NODE_ENV === 'development',
      cache: {
        ttl: 5 * 60 * 1000,
        maxSize: 100,
        enabled: true,
      },
      ...config,
    }

    this.setupDefaultInterceptors()
  }

  /**
   * GET 请求
   */
  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, config)
  }

  /**
   * POST 请求
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { ...config, data })
  }

  /**
   * PUT 请求
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { ...config, data })
  }

  /**
   * DELETE 请求
   */
  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, config)
  }

  /**
   * PATCH 请求
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, { ...config, data })
  }

  /**
   * 核心请求方法
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    let requestConfig: RequestConfig = {
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      ...config,
    }

    const url = this.buildUrl(endpoint, requestConfig.params)

    try {
      // 应用请求拦截器
      for (const interceptor of this.interceptors.request || []) {
        requestConfig = await interceptor(requestConfig)
      }

      this.log('REQUEST', { method, url, config: requestConfig })

      const response = await this.fetchWithTimeout(
        url,
        {
          method,
          headers: requestConfig.headers,
          body: requestConfig.data
            ? JSON.stringify(requestConfig.data)
            : undefined,
        },
        requestConfig.timeout || this.config.timeout
      )

      let result: ApiResponse<T>

      if (response.ok) {
        const data = await response.json()
        result = {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        result = {
          success: false,
          error:
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString(),
        }
      }

      // 应用响应拦截器
      for (const interceptor of this.interceptors.response || []) {
        result = await interceptor(result)
      }

      this.log('RESPONSE', { url, result })

      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      const apiError: ApiError = {
        code: 'REQUEST_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        timestamp: new Date().toISOString(),
      }

      // 应用错误拦截器
      for (const interceptor of this.interceptors.error || []) {
        await interceptor(apiError)
      }

      this.log('ERROR', { url, error: apiError })

      return {
        success: false,
        error: apiError.message,
        timestamp: apiError.timestamp,
      }
    }
  }

  /**
   * 带超时的fetch
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * 构建URL
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint.startsWith('http')
      ? endpoint
      : `${this.config.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    return url
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.request = this.interceptors.request || []
    this.interceptors.request.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.interceptors.response = this.interceptors.response || []
    this.interceptors.response.push(interceptor)
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.interceptors.error = this.interceptors.error || []
    this.interceptors.error.push(interceptor)
  }

  /**
   * 设置默认拦截器
   */
  private setupDefaultInterceptors(): void {
    // 默认错误处理
    this.addErrorInterceptor(async (error: ApiError) => {
      if (this.config.enableLogging) {
        console.error('[API Error]', error)
      }
      return error
    })

    // 开发模式下的请求日志
    if (this.config.environment === 'development') {
      this.addRequestInterceptor(async (config: RequestConfig) => {
        this.log('REQUEST_INTERCEPTOR', config)
        return config
      })
    }
  }

  /**
   * 日志记录
   */
  private log(type: string, data: any): void {
    if (this.config.enableLogging) {
      console.log(`[API Client - ${type}]`, data)
    }
  }

  /**
   * 获取配置
   */
  getConfig(): ServiceConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

// 创建默认客户端实例
export const defaultApiClient = new ApiClient()

// 环境适配工具
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isDevelopment = () => process.env.NODE_ENV === 'development'
