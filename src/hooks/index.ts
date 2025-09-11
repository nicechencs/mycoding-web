/**
 * 数据获取Hooks - 入口文件
 *
 * 本文件导出所有数据获取hooks，提供统一的数据访问接口
 */

// === Articles Hooks ===
export {
  useArticles,
  useArticle,
  useFeaturedArticles,
  useArticlesByCategory,
  useLatestArticles,
  useArticleComments,
  useRelatedArticles,
  useSearchArticles,
  prefetchArticle,
  prefetchArticles,
  prefetchFeaturedArticles,
} from './use-articles'

// === Resources Hooks ===
export {
  useResources,
  useResource,
  useResourceBySlug,
  useFeaturedResources,
  useResourcesByCategory,
  useResourceComments,
  useResourceRatings,
  useResourceRatingDistribution,
  useRelatedResources,
  useSearchResources,
  useResourceCategories,
  useResourceDetail,
  prefetchResource,
  prefetchResourceBySlug,
  prefetchResources,
  prefetchFeaturedResources,
} from './use-resources'

// === Vibes Hooks ===
export {
  useVibes,
  useVibe,
  useLatestVibes,
  useVibesByUser,
  useVibeComments,
  useRelatedVibes,
  useSearchVibes,
  useVibesByTag,
  useTrendingTags,
  useVibeDetail,
  useVibeStream,
  useUserVibeStream,
  prefetchVibe,
  prefetchVibes,
  prefetchLatestVibes,
  prefetchVibesByUser,
} from './use-vibes'

// === Users Hooks ===
export {
  useCurrentUser,
  useUser,
  useUserByEmail,
  useUserStats,
  useUserPreferences,
  useSearchUsers,
  useUserFollowing,
  useUserFollowers,
  useIsFollowing,
  useUserProfile,
  useUserActions,
  useCurrentUserProfile,
  prefetchUser,
  prefetchCurrentUser,
  prefetchUserStats,
} from './use-users'

// === Utility Hooks ===
export {
  useLazyImage,
  clearImageCache,
  getImageCacheSize,
} from './use-lazy-image'

export { usePerformance, PerformanceTracker } from './use-performance'

export { useNavigationHandler } from './use-navigation-handler'

// === Hook管理器 ===
export class HookManager {
  /**
   * 预加载首页所需的所有数据
   */
  static async preloadHomePage() {
    const promises = [
      import('./use-articles').then(module =>
        module.prefetchFeaturedArticles(6)
      ),
      import('./use-resources').then(module =>
        module.prefetchFeaturedResources(6)
      ),
      import('./use-vibes').then(module => module.prefetchLatestVibes(10)),
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Failed to preload some home page data:', error)
    }
  }

  /**
   * 预加载用户仪表板数据
   */
  static async preloadDashboard() {
    const promises = [
      import('./use-users').then(module => module.prefetchCurrentUser()),
      import('./use-articles').then(module =>
        module.prefetchArticles({ limit: 5, sortBy: 'latest' })
      ),
      import('./use-vibes').then(module => module.prefetchLatestVibes(5)),
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Failed to preload some dashboard data:', error)
    }
  }

  /**
   * 预加载文章详情页数据
   */
  static async preloadArticleDetail(slug: string) {
    try {
      const [articleModule, vibesModule] = await Promise.all([
        import('./use-articles'),
        import('./use-vibes'),
      ])

      await Promise.allSettled([
        articleModule.prefetchArticle(slug),
        // 可以预加载一些相关数据
      ])
    } catch (error) {
      console.warn('Failed to preload article detail data:', error)
    }
  }

  /**
   * 预加载资源详情页数据
   */
  static async preloadResourceDetail(slug: string) {
    try {
      const resourceModule = await import('./use-resources')
      await resourceModule.prefetchResourceBySlug(slug)
    } catch (error) {
      console.warn('Failed to preload resource detail data:', error)
    }
  }
}

// === 默认导出 ===
export default HookManager
