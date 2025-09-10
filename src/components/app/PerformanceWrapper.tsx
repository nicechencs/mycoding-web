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
    onReport: (metrics) => {
      // 可以发送到分析服务
      console.log('Performance metrics reported:', metrics)
    }
  })

  useEffect(() => {
    // 应用启动时的性能优化
    const startTime = performance.now()
    
    // 预加载关键资源
    if (typeof window !== 'undefined') {
      // 延迟预加载非关键组件
      requestIdleCallback(() => {
        DynamicImportManager.preloadHomeComponents()
      })
      
      // 监听用户交互，预加载可能需要的组件
      const handleFirstInteraction = () => {
        DynamicImportManager.preloadUserComponents()
        // 移除监听器，只执行一次
        window.removeEventListener('click', handleFirstInteraction)
        window.removeEventListener('keydown', handleFirstInteraction)
        window.removeEventListener('touchstart', handleFirstInteraction)
      }
      
      window.addEventListener('click', handleFirstInteraction, { passive: true })
      window.addEventListener('keydown', handleFirstInteraction, { passive: true })
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
      
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

// 使用 requestIdleCallback 的polyfill
declare global {
  interface Window {
    requestIdleCallback?: (
      callback: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void,
      options?: { timeout?: number }
    ) => number
    cancelIdleCallback?: (id: number) => void
  }
}

// requestIdleCallback polyfill for browsers that don't support it
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  window.requestIdleCallback = function(callback, options = {}) {
    const startTime = Date.now()
    return setTimeout(() => {
      callback({
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - startTime))
        },
        didTimeout: false
      })
    }, 1) as unknown as number
  }
  
  window.cancelIdleCallback = function(id) {
    clearTimeout(id)
  }
}

export default PerformanceWrapper