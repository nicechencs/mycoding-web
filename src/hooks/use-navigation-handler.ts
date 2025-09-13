import { useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  title: string
  href: string
}

interface NavigationHandlerOptions {
  platform: 'desktop' | 'mobile'
  onNavigate?: () => void
}

/**
 * 统一的导航处理Hook
 * 提供桌面端和移动端通用的导航逻辑
 */
export function useNavigationHandler(options: NavigationHandlerOptions) {
  const pathname = usePathname()
  const { platform, onNavigate } = options

  const handleNavigation = useCallback((item: NavigationItem, event: React.MouseEvent) => {
    // 统一的导航日志记录
    console.log(`${platform.charAt(0).toUpperCase() + platform.slice(1)} navigation clicked:`, {
      title: item.title,
      href: item.href,
      currentPath: pathname,
      timestamp: new Date().toISOString(),
    })
    
    // 调试信息记录（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('Event details:', {
        target: event.target,
        currentTarget: event.currentTarget,
        bubbles: event.bubbles,
        defaultPrevented: event.defaultPrevented,
      })
    }
    
    // 执行平台特定的操作
    if (onNavigate) {
      onNavigate()
    }
    
    // 不阻止默认行为，让Next.js Link组件正常处理导航
    // 如果需要自定义导航逻辑，可以在这里添加
  }, [platform, pathname, onNavigate])

  const isActiveRoute = useCallback((href: string) => {
    if (!href) return false
    // 根路径只在首页时高亮
    if (href === '/') return pathname === '/'
    // 精确匹配或子路径匹配均视为激活
    return pathname === href || pathname.startsWith(href + '/')
  }, [pathname])

  const getNavigationClassName = useCallback((href: string, baseClasses: string, activeClasses: string) => {
    return isActiveRoute(href) 
      ? `${baseClasses} ${activeClasses}` 
      : `${baseClasses} text-gray-600`
  }, [isActiveRoute])

  return {
    handleNavigation,
    isActiveRoute,
    getNavigationClassName,
    currentPath: pathname
  }
}
