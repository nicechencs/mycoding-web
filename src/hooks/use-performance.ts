'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

// 性能指标类型
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay  
  cls?: number // Cumulative Layout Shift
  
  // 其他性能指标
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
  
  // 自定义指标
  componentLoadTime?: number
  imageLoadTime?: number
  bundleSize?: number
  
  // 网络信息
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
}

// 性能观察器类型
export type PerformanceObserverType = 'paint' | 'largest-contentful-paint' | 'first-input' | 'layout-shift' | 'navigation' | 'measure'

// Hook选项
export interface UsePerformanceOptions {
  // 是否启用性能监控
  enabled?: boolean
  // 是否上报数据
  reportData?: boolean
  // 上报回调
  onReport?: (metrics: PerformanceMetrics) => void
  // 采样率 (0-1)
  sampleRate?: number
  // 调试模式
  debug?: boolean
}

// 性能监控Hook
export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enabled = true,
    reportData = false,
    onReport,
    sampleRate = 1,
    debug = false,
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isReporting, setIsReporting] = useState(false)
  const observersRef = useRef<PerformanceObserver[]>([])
  const metricsRef = useRef<PerformanceMetrics>({})

  // 日志工具
  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[Performance] ${message}`, data)
    }
  }, [debug])

  // 更新指标
  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    metricsRef.current = { ...metricsRef.current, ...newMetrics }
    setMetrics(metricsRef.current)
    log('Metrics updated', newMetrics)
  }, [log])

  // 创建性能观察器
  const createObserver = useCallback((
    type: PerformanceObserverType,
    callback: (entries: PerformanceEntryList) => void
  ) => {
    if (!('PerformanceObserver' in window)) {
      log('PerformanceObserver not supported')
      return null
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ type, buffered: true })
      observersRef.current.push(observer)
      log(`Observer created for type: ${type}`)
      return observer
    } catch (error) {
      log(`Failed to create observer for type: ${type}`, error)
      return null
    }
  }, [log])

  // 观察LCP (Largest Contentful Paint)
  const observeLCP = useCallback(() => {
    createObserver('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      updateMetrics({ lcp: lastEntry.startTime })
    })
  }, [createObserver, updateMetrics])

  // 观察FID (First Input Delay)
  const observeFID = useCallback(() => {
    createObserver('first-input', (entries) => {
      const firstInput = entries[0] as any
      if (firstInput) {
        const fid = firstInput.processingStart - firstInput.startTime
        updateMetrics({ fid })
      }
    })
  }, [createObserver, updateMetrics])

  // 观察CLS (Cumulative Layout Shift)
  const observeCLS = useCallback(() => {
    let clsValue = 0
    
    createObserver('layout-shift', (entries) => {
      for (const entry of entries as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      updateMetrics({ cls: clsValue })
    })
  }, [createObserver, updateMetrics])

  // 观察FCP (First Contentful Paint)
  const observeFCP = useCallback(() => {
    createObserver('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        updateMetrics({ fcp: fcpEntry.startTime })
      }
    })
  }, [createObserver, updateMetrics])

  // 观察导航时间
  const observeNavigation = useCallback(() => {
    createObserver('navigation', (entries) => {
      const navEntry = entries[0] as PerformanceNavigationTiming
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart
        updateMetrics({ ttfb })
      }
    })
  }, [createObserver, updateMetrics])

  // 获取网络信息
  const getNetworkInfo = useCallback(() => {
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection
      updateMetrics({
        connectionType: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      })
    }
  }, [updateMetrics])

  // 测量组件加载时间
  const measureComponentLoad = useCallback((componentName: string, startTime: number) => {
    const endTime = performance.now()
    const loadTime = endTime - startTime
    
    updateMetrics({ 
      componentLoadTime: loadTime 
    })
    
    log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`)
    return loadTime
  }, [updateMetrics, log])

  // 测量图片加载时间
  const measureImageLoad = useCallback((imageUrl: string, startTime: number) => {
    const endTime = performance.now()
    const loadTime = endTime - startTime
    
    updateMetrics({ 
      imageLoadTime: loadTime 
    })
    
    log(`Image ${imageUrl} loaded in ${loadTime.toFixed(2)}ms`)
    return loadTime
  }, [updateMetrics, log])

  // 上报性能数据
  const reportMetrics = useCallback(async () => {
    if (!reportData || isReporting) return
    
    // 采样率控制
    if (Math.random() > sampleRate) {
      log('Skipped reporting due to sample rate')
      return
    }

    setIsReporting(true)
    
    try {
      const finalMetrics = { 
        ...metricsRef.current,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }
      
      if (onReport) {
        await onReport(finalMetrics)
      } else {
        // 默认上报到控制台
        log('Performance Metrics Report', finalMetrics)
      }
    } catch (error) {
      log('Failed to report metrics', error)
    } finally {
      setIsReporting(false)
    }
  }, [reportData, isReporting, sampleRate, onReport, log])

  // 获取Bundle大小（如果可用）
  const getBundleSize = useCallback(() => {
    if ('navigator' in window && 'storage' in navigator) {
      // 使用估算的存储使用量作为Bundle大小的近似值
      (navigator as any).storage.estimate?.().then((estimate: any) => {
        updateMetrics({ bundleSize: estimate.usage })
      }).catch(() => {
        log('Failed to get bundle size estimate')
      })
    }
  }, [updateMetrics, log])

  // 清理观察器
  const cleanup = useCallback(() => {
    observersRef.current.forEach(observer => {
      observer.disconnect()
    })
    observersRef.current = []
    log('All observers disconnected')
  }, [log])

  // 初始化性能监控
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    log('Performance monitoring enabled')

    // 设置各种观察器
    observeLCP()
    observeFID()  
    observeCLS()
    observeFCP()
    observeNavigation()
    
    // 获取网络信息
    getNetworkInfo()
    getBundleSize()

    // 页面加载完成后上报
    const handleLoad = () => {
      setTimeout(() => {
        reportMetrics()
      }, 1000) // 延迟1秒确保所有指标都收集到
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    // 页面卸载时上报
    const handleBeforeUnload = () => {
      reportMetrics()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      cleanup()
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, observeLCP, observeFID, observeCLS, observeFCP, observeNavigation, getNetworkInfo, getBundleSize, reportMetrics, cleanup, log])

  return {
    metrics,
    isReporting,
    measureComponentLoad,
    measureImageLoad,
    reportMetrics,
    cleanup,
  }
}

// 性能监控工具类
export class PerformanceTracker {
  private static instance: PerformanceTracker
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // 标记性能点
  mark(name: string): void {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name)
    }
  }

  // 测量性能区间
  measure(name: string, startMark: string, endMark?: string): number | null {
    if ('performance' in window && 'measure' in performance) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark)
        } else {
          performance.measure(name, startMark)
        }
        
        const measures = performance.getEntriesByName(name, 'measure')
        return measures.length > 0 ? measures[0].duration : null
      } catch (error) {
        console.warn('Failed to measure performance:', error)
        return null
      }
    }
    return null
  }

  // 获取指标
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // 清理
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

export default usePerformance