/**
 * 统一数据服务架构 - 入口文件
 *
 * 本文件导出所有服务实例和相关类型，提供统一的API访问点
 */

// === 基础服务层 ===
export { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
export { CacheManager, globalCache } from './base/cache-manager'
export * from './base/types'

// === 具体服务实现 ===
export { ArticlesService, articlesService } from './articles.service'
export { ResourcesService, resourcesService } from './resources.service'
export { VibesService, vibesService } from './vibes.service'
export {
  UsersService,
  usersService,
  type UserUpdateData,
  type UserStats,
  type UserPreferences,
} from './users.service'

// === 服务接口导出 ===
export type { IArticlesService } from './articles.service'
export type { IResourcesService } from './resources.service'
export type { IVibesService } from './vibes.service'
export type { IUsersService } from './users.service'

// === 统一服务管理器 ===
export class ServiceManager {
  static get articles() {
    return articlesService
  }
  static get resources() {
    return resourcesService
  }
  static get vibes() {
    return vibesService
  }
  static get users() {
    return usersService
  }

  /**
   * 获取所有服务的缓存统计信息
   */
  static getCacheStats() {
    return globalCache.getStats()
  }

  /**
   * 清除所有服务缓存
   */
  static clearAllCache() {
    globalCache.clear()
  }

  /**
   * 清理过期缓存
   */
  static cleanupCache() {
    return globalCache.cleanup()
  }
}

// === 默认导出 ===
export default ServiceManager
