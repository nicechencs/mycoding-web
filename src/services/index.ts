/**
 * 统一数据服务架构 - 入口文件
 *
 * 本文件导出所有服务实例和相关类型，提供统一的API访问点
 */

// === 基础服务层 ===
export { ApiClient, defaultApiClient, isDevelopment } from './base/api-client'
export { CacheManager, globalCache } from './base/cache-manager'
// 引入到本地作用域，供下方 ServiceManager 使用
import { globalCache as _globalCache } from './base/cache-manager'
export * from './base/types'

// === 具体服务实现 ===
export { ArticlesService, articlesService } from './articles.service'
export { ResourcesService, resourcesService } from './resources.service'
export { VibesService, vibesService } from './vibes.service'
// 引入到本地作用域，供下方 ServiceManager 使用
import { articlesService as _articlesService } from './articles.service'
import { resourcesService as _resourcesService } from './resources.service'
import { vibesService as _vibesService } from './vibes.service'
export {
  UsersService,
  usersService,
  type UserUpdateData,
  type UserStats,
  type UserPreferences,
} from './users.service'
// 引入到本地作用域，供下方 ServiceManager 使用
import { usersService as _usersService } from './users.service'

// === 服务接口导出 ===
export type { IArticlesService } from './articles.service'
export type { IResourcesService } from './resources.service'
export type { IVibesService } from './vibes.service'
export type { IUsersService } from './users.service'

// === 统一服务管理器 ===
export class ServiceManager {
  static get articles() {
    return _articlesService
  }
  static get resources() {
    return _resourcesService
  }
  static get vibes() {
    return _vibesService
  }
  static get users() {
    return _usersService
  }

  /**
   * 获取所有服务的缓存统计信息
   */
  static getCacheStats() {
    return _globalCache.getStats()
  }

  /**
   * 清除所有服务缓存
   */
  static clearAllCache() {
    _globalCache.clear()
  }

  /**
   * 清理过期缓存
   */
  static cleanupCache() {
    return _globalCache.cleanup()
  }
}

// === 默认导出 ===
export default ServiceManager
