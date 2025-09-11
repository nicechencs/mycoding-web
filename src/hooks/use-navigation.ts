import { useCallback } from 'react'

/**
 * 导航钩子 - 解决 router.push 不工作的问题
 * 使用原生方法作为后备方案
 */
export function useNavigation() {
  const navigate = useCallback((url: string) => {
    // 尝试多种导航方法
    
    // 方法1: 使用 window.location
    if (typeof window !== 'undefined') {
      // 对于相对路径，使用 location.href
      if (url.startsWith('/')) {
        window.location.href = url
      } else {
        // 对于绝对路径
        window.location.href = url
      }
      return
    }
  }, [])

  const softNavigate = useCallback((url: string) => {
    // 创建一个隐藏的 Link 并触发点击
    if (typeof document !== 'undefined') {
      const link = document.createElement('a')
      link.href = url
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [])

  return {
    navigate,      // 硬导航（页面刷新）
    softNavigate   // 软导航（尝试客户端导航）
  }
}