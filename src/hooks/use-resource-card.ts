import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Resource } from '@/types/resource'

/**
 * ResourceCard组件的交互逻辑Hook
 * 简化的事件处理，移除复杂的DOM查询和调试日志
 */
export function useResourceCard(resource: Resource) {
  const router = useRouter()

  /**
   * 处理卡片点击事件
   * 简洁的实现，只处理核心导航逻辑
   */
  const handleCardClick = useCallback((e?: React.MouseEvent) => {
    // React会自动传递事件对象，我们需要接收它
    router.push(`/resources/${resource.slug}`)
  }, [router, resource.slug])

  /**
   * 处理动作按钮点击事件
   * 阻止事件冒泡，避免触发卡片点击
   */
  const handleActionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/resources/${resource.slug}`)
  }, [router, resource.slug])

  return {
    handleCardClick,
    handleActionClick,
  }
}