import { useCallback } from 'react'
import { Resource } from '@/types/resource'
import { useNavigation } from './use-navigation'

/**
 * ResourceCard组件的交互逻辑Hook
 * 简化的事件处理，移除复杂的DOM查询和调试日志
 */
export function useResourceCard(resource: Resource) {
  const { navigate } = useNavigation()

  /**
   * 处理卡片点击事件
   * 简洁的实现，只处理核心导航逻辑
   */
  const handleCardClick = useCallback((e?: React.MouseEvent) => {
    // React会自动传递事件对象，我们需要接收它
    navigate(`/resources/${resource.slug}`)
  }, [navigate, resource.slug])

  /**
   * 处理动作按钮点击事件
   * 阻止事件冒泡，避免触发卡片点击
   */
  const handleActionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/resources/${resource.slug}`)
  }, [navigate, resource.slug])

  return {
    handleCardClick,
    handleActionClick,
  }
}