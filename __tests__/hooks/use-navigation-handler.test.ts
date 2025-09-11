import { renderHook, act } from '@testing-library/react'
import { useNavigationHandler } from '@/hooks/use-navigation-handler'
import { usePathname } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('useNavigationHandler Hook', () => {
  const mockUsePathname = usePathname as jest.Mock
  const mockEvent = {
    target: document.createElement('a'),
    currentTarget: document.createElement('a'),
    bubbles: true,
    defaultPrevented: false,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  } as unknown as React.MouseEvent

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/resources')
    // 模拟 console.log
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('基础功能测试', () => {
    it('应该返回导航处理器函数', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))

      expect(result.current).toHaveProperty('handleNavigation')
      expect(result.current).toHaveProperty('isActiveRoute')
      expect(result.current).toHaveProperty('getNavigationClassName')
      expect(result.current).toHaveProperty('currentPath')
      
      expect(typeof result.current.handleNavigation).toBe('function')
      expect(typeof result.current.isActiveRoute).toBe('function')
      expect(typeof result.current.getNavigationClassName).toBe('function')
      expect(result.current.currentPath).toBe('/resources')
    })

    it('应该正确生成导航类名', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const baseClasses = 'base-class'
      const activeClasses = 'active-class'
      
      // 当前路径匹配时
      const activeClassName = result.current.getNavigationClassName(
        '/resources',
        baseClasses,
        activeClasses
      )
      expect(activeClassName).toBe('base-class active-class')
      
      // 当前路径不匹配时
      const inactiveClassName = result.current.getNavigationClassName(
        '/posts',
        baseClasses,
        activeClasses
      )
      expect(inactiveClassName).toBe('base-class')
    })
  })

  describe('桌面端导航测试', () => {
    it('应该正确处理桌面端导航点击', () => {
      const onNavigate = jest.fn()
      const { result } = renderHook(() => useNavigationHandler({ 
        platform: 'desktop',
        onNavigate 
      }))
      
      const navigationItem = {
        title: '资源',
        href: '/resources'
      }

      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })

      // 验证日志记录
      expect(console.log).toHaveBeenCalledWith(
        'Desktop navigation clicked:',
        expect.objectContaining({
          title: '资源',
          href: '/resources',
          currentPath: '/resources',
          timestamp: expect.any(String)
        })
      )
      
      // 验证回调执行
      expect(onNavigate).toHaveBeenCalledTimes(1)
    })

    it('应该为活动路由生成正确的类名', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const className = result.current.getNavigationClassName(
        '/resources',
        'px-3 py-2 text-sm font-medium',
        'bg-gray-900 text-white'
      )
      
      expect(className).toBe('px-3 py-2 text-sm font-medium bg-gray-900 text-white')
    })

    it('应该为非活动路由生成正确的类名', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const className = result.current.getNavigationClassName(
        '/posts',
        'px-3 py-2 text-sm font-medium',
        'bg-gray-900 text-white'
      )
      
      expect(className).toBe('px-3 py-2 text-sm font-medium')
    })
  })

  describe('移动端导航测试', () => {
    it('应该正确处理移动端导航点击', () => {
      const onNavigate = jest.fn()
      const { result } = renderHook(() => useNavigationHandler({ 
        platform: 'mobile',
        onNavigate 
      }))
      
      const navigationItem = {
        title: '文章',
        href: '/posts'
      }

      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })

      // 验证日志记录
      expect(console.log).toHaveBeenCalledWith(
        'Mobile navigation clicked:',
        expect.objectContaining({
          title: '文章',
          href: '/posts',
          currentPath: '/resources',
          timestamp: expect.any(String)
        })
      )
      
      // 验证回调执行
      expect(onNavigate).toHaveBeenCalledTimes(1)
    })

    it('应该为移动端活动路由生成正确的类名', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'mobile' }))
      
      const className = result.current.getNavigationClassName(
        '/resources',
        'block px-3 py-2 text-base font-medium',
        'bg-gray-900 text-white'
      )
      
      expect(className).toBe('block px-3 py-2 text-base font-medium bg-gray-900 text-white')
    })

    it('应该为移动端非活动路由生成正确的类名', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'mobile' }))
      
      const className = result.current.getNavigationClassName(
        '/posts',
        'block px-3 py-2 text-base font-medium',
        'bg-gray-900 text-white'
      )
      
      expect(className).toBe('block px-3 py-2 text-base font-medium')
    })
  })

  describe('活动路由检测测试', () => {
    it('应该正确检测当前路径', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      expect(result.current.isActiveRoute('/resources')).toBe(true)
      expect(result.current.isActiveRoute('/posts')).toBe(false)
      expect(result.current.isActiveRoute('/about')).toBe(false)
    })

    it('应该处理根路径', () => {
      mockUsePathname.mockReturnValue('/')
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      expect(result.current.isActiveRoute('/')).toBe(true)
      expect(result.current.isActiveRoute('/resources')).toBe(false)
    })

    it('应该处理子路径', () => {
      mockUsePathname.mockReturnValue('/resources/detail')
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      // 子路径应该匹配父路径
      expect(result.current.isActiveRoute('/resources')).toBe(true)
      expect(result.current.isActiveRoute('/resources/detail')).toBe(true)
      expect(result.current.isActiveRoute('/posts')).toBe(false)
    })
  })

  describe('开发环境调试测试', () => {
    it('应该在开发环境记录调试信息', () => {
      const originalNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const navigationItem = {
        title: '测试导航',
        href: '/test'
      }

      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })

      // 验证调试日志
      expect(console.log).toHaveBeenCalledWith(
        'Event details:',
        expect.objectContaining({
          target: expect.any(Object),
          currentTarget: expect.any(Object),
          bubbles: true,
          defaultPrevented: false
        })
      )
      
      process.env.NODE_ENV = originalNodeEnv
    })

    it('应该在生产环境不记录调试信息', () => {
      const originalNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const navigationItem = {
        title: '测试导航',
        href: '/test'
      }

      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })

      // 验证只有导航日志，没有调试日志
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith(
        'Desktop navigation clicked:',
        expect.any(Object)
      )
      
      process.env.NODE_ENV = originalNodeEnv
    })
  })

  describe('边界条件测试', () => {
    it('应该处理没有回调的情况', () => {
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      const navigationItem = {
        title: '测试',
        href: '/test'
      }

      // 不应该抛出错误
      expect(() => {
        act(() => {
          result.current.handleNavigation(navigationItem, mockEvent)
        })
      }).not.toThrow()
    })

    it('应该处理特殊字符路径', () => {
      mockUsePathname.mockReturnValue('/resources?category=web-dev')
      const { result } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      expect(result.current.isActiveRoute('/resources')).toBe(true)
      expect(result.current.isActiveRoute('/resources?category=web-dev')).toBe(true)
    })

    it('应该在路径变化时更新', () => {
      const { result, rerender } = renderHook(() => useNavigationHandler({ platform: 'desktop' }))
      
      expect(result.current.currentPath).toBe('/resources')
      
      // 模拟路径变化
      mockUsePathname.mockReturnValue('/posts')
      rerender()
      
      expect(result.current.currentPath).toBe('/posts')
    })
  })

  describe('平台切换测试', () => {
    it('应该在平台切换时更新日志前缀', () => {
      const { result, rerender } = renderHook(
        ({ platform }) => useNavigationHandler({ platform }),
        { initialProps: { platform: 'desktop' as const } }
      )
      
      const navigationItem = {
        title: '测试',
        href: '/test'
      }

      // 桌面端
      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })
      
      expect(console.log).toHaveBeenCalledWith(
        'Desktop navigation clicked:',
        expect.any(Object)
      )
      
      // 切换到移动端
      jest.clearAllMocks()
      rerender({ platform: 'mobile' })
      
      act(() => {
        result.current.handleNavigation(navigationItem, mockEvent)
      })
      
      expect(console.log).toHaveBeenCalledWith(
        'Mobile navigation clicked:',
        expect.any(Object)
      )
    })
  })
})