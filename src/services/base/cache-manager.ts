import { CacheItem, CacheConfig, CacheOptions } from './types'

/**
 * 内存缓存管理器
 * 提供类型安全的缓存存储和管理功能
 */
export class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private config: CacheConfig

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 默认5分钟
      maxSize: 100, // 最大缓存项数
      enabled: true,
      ...config,
    }

    // 定期清理过期缓存
    if (this.config.enabled) {
      this.startCleanupTimer()
    }
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    if (!this.config.enabled) return

    const ttl = options.ttl ?? this.config.ttl ?? 5 * 60 * 1000
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    }

    // 如果达到最大缓存数量，删除最旧的项
    if (this.cache.size >= (this.config.maxSize ?? 100)) {
      const oldestKey = this.getOldestKey()
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, cacheItem)
  }

  /**
   * 获取缓存
   */
  get<T>(key: string, options: CacheOptions = {}): T | null {
    if (!this.config.enabled || options.skipCache) return null

    const item = this.cache.get(key) as CacheItem<T> | undefined
    if (!item) return null

    // 检查是否过期
    if (this.isExpired(item) || options.forceRefresh) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    if (!this.config.enabled) return false

    const item = this.cache.get(key)
    if (!item) return false

    if (this.isExpired(item)) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取所有缓存键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    let expiredCount = 0
    let totalSize = 0

    for (const item of this.cache.values()) {
      totalSize++
      if (this.isExpired(item)) {
        expiredCount++
      }
    }

    return {
      totalItems: totalSize,
      expiredItems: expiredCount,
      activeItems: totalSize - expiredCount,
      maxSize: this.config.maxSize ?? 100,
      enabled: this.config.enabled ?? true,
    }
  }

  /**
   * 清理过期的缓存项
   */
  cleanup(): number {
    const keysToDelete: string[] = []

    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
    return keysToDelete.length
  }

  /**
   * 检查缓存项是否过期
   */
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl
  }

  /**
   * 获取最旧的缓存键
   */
  private getOldestKey(): string | null {
    let oldestKey: string | null = null
    let oldestTimestamp = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    // 每分钟清理一次过期缓存
    setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  /**
   * 生成缓存键
   */
  static generateKey(prefix: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|')

    return sortedParams ? `${prefix}:${sortedParams}` : prefix
  }
}

// 创建全局缓存实例
export const globalCache = new CacheManager()
