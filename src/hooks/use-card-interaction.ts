import { useCallback } from 'react'
import { useNavigation } from './use-navigation'

// 支持的卡片类型
type CardType = 'resource' | 'article' | 'vibe'

// 卡片数据的通用接口
interface BaseCardItem {
  id: string
  slug?: string
}

// 路由配置类型
type RouteConfig = {
  [key in CardType]: (item: BaseCardItem) => string
}

// Hook配置选项
interface UseCardInteractionOptions {
  /**
   * 卡片类型，决定路由生成策略
   */
  cardType: CardType

  /**
   * 自定义路由生成函数，覆盖默认路由
   */
  customRouteGenerator?: (item: BaseCardItem) => string

  /**
   * 自定义的点击阻止选择器
   * 默认: 'a', 'button', 'input', '[data-no-click]'
   */
  preventClickSelectors?: string[]

  /**
   * 点击前的回调函数
   */
  beforeNavigate?: (
    item: BaseCardItem,
    event: React.MouseEvent
  ) => boolean | void

  /**
   * 点击后的回调函数
   */
  afterNavigate?: (item: BaseCardItem, route: string) => void

  /**
   * 是否启用调试日志
   */
  enableDebugLog?: boolean
}

// 默认路由配置
const DEFAULT_ROUTE_CONFIG: RouteConfig = {
  resource: item => `/resources/${item.slug || item.id}`,
  article: item => `/posts/${item.slug || item.id}`,
  vibe: item => `/vibes/${item.id}`,
}

// 默认的点击阻止选择器
// 当点击这些元素时，不触发卡片的导航
const DEFAULT_PREVENT_SELECTORS = [
  'button', // 按钮有自己的处理逻辑
  'a', // 链接有自己的跳转
  'input',
  'textarea',
  'select',
  '[data-no-click]',
]

/**
 * 统一的卡片交互Hook
 *
 * 解决所有卡片组件中重复的点击处理逻辑：
 * - 统一的事件目标检查
 * - 类型化的路由生成
 * - 可配置的交互行为
 * - 完整的TypeScript支持
 */
export function useCardInteraction<T extends BaseCardItem>(
  options: UseCardInteractionOptions
) {
  const { navigate } = useNavigation()

  const {
    cardType,
    customRouteGenerator,
    preventClickSelectors = DEFAULT_PREVENT_SELECTORS,
    beforeNavigate,
    afterNavigate,
    enableDebugLog = false,
  } = options

  /**
   * 检查点击目标是否应该被阻止
   */
  const shouldPreventClick = useCallback(
    (target: HTMLElement): boolean => {
      return preventClickSelectors.some(selector => {
        try {
          return target.closest(selector) !== null
        } catch (error) {
          // 处理无效的选择器
          if (enableDebugLog) {
            console.warn(`Invalid selector: ${selector}`, error)
          }
          return false
        }
      })
    },
    [preventClickSelectors, enableDebugLog]
  )

  /**
   * 生成路由路径
   */
  const generateRoute = useCallback(
    (item: T): string => {
      if (customRouteGenerator) {
        return customRouteGenerator(item)
      }

      const defaultGenerator = DEFAULT_ROUTE_CONFIG[cardType]
      if (!defaultGenerator) {
        throw new Error(`Unsupported card type: ${cardType}`)
      }

      return defaultGenerator(item)
    },
    [cardType, customRouteGenerator]
  )

  /**
   * 记录交互日志
   */
  const logInteraction = useCallback(
    (item: T, route: string, event: React.MouseEvent) => {
      if (enableDebugLog) {
        console.log(`Card interaction - ${cardType}:`, {
          item: {
            id: item.id,
            slug: item.slug,
            type: cardType,
          },
          route,
          eventTarget: (event.target as HTMLElement)?.tagName,
          timestamp: new Date().toISOString(),
        })
      }
    },
    [cardType, enableDebugLog]
  )

  /**
   * 主要的点击处理函数
   */
  const handleCardClick = useCallback(
    (item: T) => {
      return (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement

        // 检查是否应该阻止点击
        if (shouldPreventClick(target)) {
          return
        }

        // 执行前置回调
        if (beforeNavigate) {
          const result = beforeNavigate(item, event)
          // 如果明确返回 false，则阻止导航
          if (result === false) {
            return
          }
        }

        try {
          // 生成路由并导航
          const route = generateRoute(item)

          // 记录交互日志
          logInteraction(item, route, event)

          // 执行导航
          navigate(route)

          // 执行后置回调
          if (afterNavigate) {
            afterNavigate(item, route)
          }
        } catch (error) {
          if (enableDebugLog) {
            console.error(
              `Card navigation failed for ${cardType}:`,
              error,
              item
            )
          }

          // 在生产环境中，你可能想要上报这个错误
          // reportError(error, { cardType, item })
        }
      }
    },
    [
      shouldPreventClick,
      beforeNavigate,
      generateRoute,
      logInteraction,
      navigate,
      afterNavigate,
      cardType,
      enableDebugLog,
    ]
  )

  /**
   * 创建操作按钮的点击处理函数
   * 与卡片点击不同，这个会阻止事件冒泡
   */
  const handleActionClick = useCallback(
    (item: T, action?: () => void) => {
      return (event: React.MouseEvent<HTMLElement>) => {
        // 阻止事件冒泡到卡片
        event.stopPropagation()

        if (action) {
          action()
        } else {
          // 如果没有自定义操作，执行默认的卡片导航
          handleCardClick(item)(event)
        }
      }
    },
    [handleCardClick]
  )

  /**
   * 获取卡片的基础交互属性
   */
  const getCardProps = useCallback(
    (item: T) => {
      return {
        onClick: handleCardClick(item),
        className: 'cursor-pointer',
        role: 'button',
        tabIndex: 0,
        'data-card-type': cardType,
        'data-card-id': item.id,
      }
    },
    [handleCardClick, cardType]
  )

  /**
   * 为统计项目创建点击处理
   */
  const handleStatsClick = useCallback(
    (
      item: T,
      statType: string,
      customHandler?: (item: T, statType: string) => void
    ) => {
      return (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()

        if (customHandler) {
          customHandler(item, statType)
        } else {
          // 默认行为：导航到详情页的对应部分
          const route = generateRoute(item)
          const anchorRoute = `${route}#${statType}`
          navigate(anchorRoute)
        }

        if (enableDebugLog) {
          console.log(`Stats interaction - ${statType}:`, {
            cardType,
            itemId: item.id,
            statType,
            timestamp: new Date().toISOString(),
          })
        }
      }
    },
    [generateRoute, navigate, cardType, enableDebugLog]
  )

  return {
    // 核心交互函数
    handleCardClick,
    handleActionClick,
    handleStatsClick,

    // 辅助函数
    getCardProps,
    generateRoute,
    shouldPreventClick,

    // 工具函数
    logInteraction,
  }
}

/**
 * 预定义的卡片交互Hook实例
 * 提供常用配置的快捷方式
 */

// 资源卡片交互Hook
export const useResourceCardInteraction = <T extends BaseCardItem>(
  options?: Partial<Omit<UseCardInteractionOptions, 'cardType'>>
) => {
  return useCardInteraction<T>({
    cardType: 'resource',
    enableDebugLog: process.env.NODE_ENV === 'development',
    ...options,
  })
}

// 文章卡片交互Hook
export const useArticleCardInteraction = <T extends BaseCardItem>(
  options?: Partial<Omit<UseCardInteractionOptions, 'cardType'>>
) => {
  return useCardInteraction<T>({
    cardType: 'article',
    enableDebugLog: process.env.NODE_ENV === 'development',
    ...options,
  })
}

// 动态卡片交互Hook
export const useVibeCardInteraction = <T extends BaseCardItem>(
  options?: Partial<Omit<UseCardInteractionOptions, 'cardType'>>
) => {
  return useCardInteraction<T>({
    cardType: 'vibe',
    enableDebugLog: process.env.NODE_ENV === 'development',
    ...options,
  })
}

/**
 * 类型导出
 */
export type { UseCardInteractionOptions, BaseCardItem, CardType }
