import { renderHook } from '@testing-library/react'
import { useNavigationHandler } from '@/hooks/use-navigation-handler'

// Mock next/navigation
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockPathname = '/current-path'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => mockPathname,
}))

// Mock console methods
const originalConsoleLog = console.log
const consoleLogSpy = jest.fn()

describe('useNavigationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = consoleLogSpy
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  describe('基础功能测试', () => {
    it('应该返回桌面端和移动端导航处理器', () => {
      const { result } = renderHook(() => useNavigationHandler())

      expect(result.current).toHaveProperty('desktopNavigation')
      expect(result.current).toHaveProperty('mobileNavigation')
      
      const { desktopNavigation, mobileNavigation } = result.current
      
      expect(typeof desktopNavigation.handleNavigation).toBe('function')
      expect(typeof desktopNavigation.getNavigationClassName).toBe('function')
      expect(typeof mobileNavigation.handleNavigation).toBe('function')
      expect(typeof mobileNavigation.getNavigationClassName).toBe('function')
    })

    it('应该正确生成导航类名', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      // 测试当前路径匹配
      const activeClassName = desktopNavigation.getNavigationClassName(
        '/current-path',
        'base-class',
        'active-class'
      )
      expect(activeClassName).toBe('base-class active-class')

      // 测试当前路径不匹配
      const inactiveClassName = desktopNavigation.getNavigationClassName(
        '/other-path',
        'base-class',
        'active-class'
      )
      expect(inactiveClassName).toBe('base-class')
    })
  })

  describe('桌面端导航行为', () => {
    it('应该正确处理桌面端导航点击', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      const mockItem = {
        title: 'Test Page',
        href: '/test-page',
        disabled: false
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      desktopNavigation.handleNavigation(mockItem, mockEvent)

      // 验证路由跳转
      expect(mockPush).toHaveBeenCalledWith('/test-page')
      
      // 验证日志记录
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Desktop navigation clicked:',
        expect.objectContaining({
          title: 'Test Page',
          href: '/test-page',
          currentPath: '/current-path'
        })
      )
    })

    it('应该处理禁用的导航项', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      const disabledItem = {
        title: 'Disabled Page',
        href: '/disabled-page',
        disabled: true
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      desktopNavigation.handleNavigation(disabledItem, mockEvent)

      // 禁用项不应该触发路由跳转
      expect(mockPush).not.toHaveBeenCalled()
      expect(consoleLogSpy).not.toHaveBeenCalled()
    })
  })

  describe('移动端导航行为', () => {
    it('应该正确处理移动端导航点击', () => {
      const onClose = jest.fn()
      const { result } = renderHook(() => useNavigationHandler())
      const { mobileNavigation } = result.current

      const mockItem = {
        title: 'Mobile Page',
        href: '/mobile-page',
        disabled: false
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      mobileNavigation.handleNavigation(mockItem, mockEvent, onClose)

      // 验证路由跳转
      expect(mockPush).toHaveBeenCalledWith('/mobile-page')
      
      // 验证关闭回调
      expect(onClose).toHaveBeenCalled()
      
      // 验证日志记录
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Mobile navigation clicked:',
        expect.objectContaining({
          title: 'Mobile Page',
          href: '/mobile-page',
          currentPath: '/current-path'
        })
      )
    })

    it('应该在没有onClose回调时正常工作', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { mobileNavigation } = result.current

      const mockItem = {
        title: 'Mobile Page',
        href: '/mobile-page',
        disabled: false
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      // 不传入onClose回调
      expect(() => {
        mobileNavigation.handleNavigation(mockItem, mockEvent)
      }).not.toThrow()

      expect(mockPush).toHaveBeenCalledWith('/mobile-page')
    })
  })

  describe('边界条件测试', () => {
    it('应该处理没有href的导航项', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      const mockItem = {
        title: 'No Href',
        disabled: false
        // href 缺失
      } as any

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      expect(() => {
        desktopNavigation.handleNavigation(mockItem, mockEvent)
      }).not.toThrow()

      // 没有href时不应该调用路由跳转
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('应该处理空字符串href', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      const mockItem = {
        title: 'Empty Href',
        href: '',
        disabled: false
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      desktopNavigation.handleNavigation(mockItem, mockEvent)

      // 空href仍然会调用路由跳转（可能导航到根路径）
      expect(mockPush).toHaveBeenCalledWith('')
    })

    it('应该正确处理路径匹配的边界情况', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      // 测试完全匹配
      expect(
        desktopNavigation.getNavigationClassName('/current-path', 'base', 'active')
      ).toBe('base active')

      // 测试大小写敏感
      expect(
        desktopNavigation.getNavigationClassName('/Current-Path', 'base', 'active')
      ).toBe('base')

      // 测试部分匹配（应该不匹配）
      expect(
        desktopNavigation.getNavigationClassName('/current-path/sub', 'base', 'active')
      ).toBe('base')
    })
  })

  describe('日志记录测试', () => {
    it('应该记录完整的导航信息', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation } = result.current

      const mockItem = {
        title: 'Test Page',
        href: '/test-page',
        disabled: false
      }

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any

      desktopNavigation.handleNavigation(mockItem, mockEvent)

      const logCall = consoleLogSpy.mock.calls[0]
      expect(logCall[0]).toBe('Desktop navigation clicked:')
      
      const logData = logCall[1]
      expect(logData).toHaveProperty('title', 'Test Page')
      expect(logData).toHaveProperty('href', '/test-page')
      expect(logData).toHaveProperty('currentPath', '/current-path')
      expect(logData).toHaveProperty('timestamp')
      expect(typeof logData.timestamp).toBe('string')
    })
  })

  describe('性能和记忆化测试', () => {
    it('应该在pathname不变时返回相同的引用', () => {
      const { result, rerender } = renderHook(() => useNavigationHandler())
      
      const firstRender = result.current
      rerender()
      const secondRender = result.current

      // 由于使用了useMemo，在pathname不变时应该返回相同引用
      expect(firstRender.desktopNavigation).toBe(secondRender.desktopNavigation)
      expect(firstRender.mobileNavigation).toBe(secondRender.mobileNavigation)
    })
  })

  describe('集成测试', () => {
    it('应该支持复杂的导航场景', () => {
      const { result } = renderHook(() => useNavigationHandler())
      const { desktopNavigation, mobileNavigation } = result.current

      const navigationItems = [
        { title: 'Home', href: '/', disabled: false },
        { title: 'About', href: '/about', disabled: false },
        { title: 'Contact', href: '/contact', disabled: true },
        { title: 'Current', href: '/current-path', disabled: false }
      ]

      navigationItems.forEach((item, index) => {
        const mockEvent = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn()
        } as any

        if (!item.disabled) {
          // 测试桌面端
          desktopNavigation.handleNavigation(item, mockEvent)
          expect(mockPush).toHaveBeenCalledWith(item.href)

          // 测试移动端
          const onClose = jest.fn()
          mobileNavigation.handleNavigation(item, mockEvent, onClose)
          expect(onClose).toHaveBeenCalled()

          // 测试类名生成
          const className = desktopNavigation.getNavigationClassName(
            item.href, 'base-class', 'active-class'
          )
          
          if (item.href === '/current-path') {
            expect(className).toBe('base-class active-class')
          } else {
            expect(className).toBe('base-class')
          }
        }

        jest.clearAllMocks()
      })
    })
  })
})