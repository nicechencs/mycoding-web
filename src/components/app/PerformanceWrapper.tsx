'use client'

import React, { useEffect } from 'react'
import { usePerformance } from '@/hooks/use-performance'
import { DynamicImportManager } from '@/lib/utils/dynamic-imports'

interface PerformanceWrapperProps {
  children: React.ReactNode
}

export function PerformanceWrapper({ children }: PerformanceWrapperProps) {
  // 启用性能监控
  const { metrics, measureComponentLoad } = usePerformance({
    enabled: true,
    reportData: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    sampleRate: 0.1, // 10% 采样率
    onReport: metrics => {
      // 可以发送到分析服务
      console.log('Performance metrics reported:', metrics)
    },
  })

  useEffect(() => {
    // 应用启动时的性能优化
    const startTime = performance.now()

    // 预加载关键资源
    if (typeof window !== 'undefined') {
      // 延迟预加载非关键组件
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          DynamicImportManager.preloadHomeComponents()
        })
      } else {
        setTimeout(() => {
          DynamicImportManager.preloadHomeComponents()
        }, 1)
      }

      // 监听用户交互，预加载可能需要的组件
      const handleFirstInteraction = () => {
        DynamicImportManager.preloadUserComponents()
        // 移除监听器，只执行一次
        window.removeEventListener('click', handleFirstInteraction, {
          capture: false,
        })
        window.removeEventListener('keydown', handleFirstInteraction, {
          capture: false,
        })
        window.removeEventListener('touchstart', handleFirstInteraction, {
          capture: false,
        })
      }

      // 使用capture阶段避免干扰正常的事件处理，但要确保不影响导航
      window.addEventListener('click', handleFirstInteraction, {
        passive: true,
        capture: false,
      })
      window.addEventListener('keydown', handleFirstInteraction, {
        passive: true,
        capture: false,
      })
      window.addEventListener('touchstart', handleFirstInteraction, {
        passive: true,
        capture: false,
      })

      // 测量应用初始化时间
      const measureInitTime = () => {
        measureComponentLoad('App', startTime)
      }

      // 等待下一个tick测量
      setTimeout(measureInitTime, 0)
    }
  }, [measureComponentLoad])

  return <>{children}</>
}

// requestIdleCallback polyfill for browsers that don't support it
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  ;(window as any).requestIdleCallback = function (callback: any) {
    const startTime = Date.now()
    return setTimeout(() => {
      callback({
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - startTime))
        },
        didTimeout: false,
      })
    }, 1) as unknown as number
  }
  ;(window as any).cancelIdleCallback = function (id: number) {
    clearTimeout(id)
  }
}

export default PerformanceWrapper
