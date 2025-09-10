'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// 加载状态类型
export type ImageLoadingState = 'idle' | 'loading' | 'loaded' | 'error'

// Hook配置选项
export interface UseLazyImageOptions {
  // 预加载相关
  preload?: boolean
  preloadOnHover?: boolean

  // 重试相关
  retryCount?: number
  retryDelay?: number

  // 缓存相关
  enableCache?: boolean
  cacheTimeout?: number // 缓存超时时间（毫秒）

  // 优化相关
  debounceDelay?: number

  // 回调
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onError?: (error: Error) => void
}

// 缓存管理
class ImageCache {
  private cache = new Map<
    string,
    {
      status: 'loading' | 'loaded' | 'error'
      timestamp: number
      promise?: Promise<HTMLImageElement>
      error?: Error
    }
  >()

  private defaultTimeout = 5 * 60 * 1000 // 5分钟默认缓存

  get(
    src: string,
    timeout?: number
  ): {
    status: 'loading' | 'loaded' | 'error'
    promise?: Promise<HTMLImageElement>
    error?: Error
  } | null {
    const cached = this.cache.get(src)
    if (!cached) return null

    const now = Date.now()
    const cacheTimeout = timeout ?? this.defaultTimeout

    if (now - cached.timestamp > cacheTimeout) {
      this.cache.delete(src)
      return null
    }

    return cached
  }

  set(
    src: string,
    status: 'loading' | 'loaded' | 'error',
    promise?: Promise<HTMLImageElement>,
    error?: Error
  ) {
    this.cache.set(src, {
      status,
      timestamp: Date.now(),
      promise,
      error,
    })
  }

  clear(src?: string) {
    if (src) {
      this.cache.delete(src)
    } else {
      this.cache.clear()
    }
  }

  size() {
    return this.cache.size
  }
}

// 全局缓存实例
const globalImageCache = new ImageCache()

// Hook返回类型
export interface UseLazyImageReturn {
  // 状态
  loadingState: ImageLoadingState
  isLoading: boolean
  isLoaded: boolean
  isError: boolean

  // 方法
  load: (src: string) => Promise<HTMLImageElement>
  preload: (src: string) => Promise<HTMLImageElement>
  retry: () => Promise<HTMLImageElement | null>
  reset: () => void

  // 事件处理器
  handleMouseEnter: () => void
  handleMouseLeave: () => void

  // 元数据
  currentSrc: string | null
  error: Error | null
  retryCount: number
}

export function useLazyImage(
  initialSrc?: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {
    preload = false,
    preloadOnHover = false,
    retryCount: maxRetryCount = 3,
    retryDelay = 1000,
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000,
    debounceDelay = 100,
    onLoadStart,
    onLoadEnd,
    onError,
  } = options

  // 状态管理
  const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle')
  const [currentSrc, setCurrentSrc] = useState<string | null>(
    initialSrc || null
  )
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const loadingPromiseRef = useRef<Promise<HTMLImageElement> | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 创建图片加载Promise
  const createImageLoadPromise = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }

      img.onload = () => {
        cleanup()
        resolve(img)
      }

      img.onerror = () => {
        cleanup()
        reject(new Error(`Failed to load image: ${src}`))
      }

      img.src = src

      // 支持中断加载
      if (abortControllerRef.current) {
        abortControllerRef.current.signal.addEventListener('abort', () => {
          cleanup()
          reject(new Error('Image loading aborted'))
        })
      }
    })
  }

  // 防抖处理
  const debounce = useCallback((fn: () => void, delay: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(fn, delay)
  }, [])

  // 核心加载函数
  const loadImage = useCallback(
    async (src: string): Promise<HTMLImageElement> => {
      // 取消之前的加载
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      // 检查缓存
      if (enableCache) {
        const cached = globalImageCache.get(src, cacheTimeout)
        if (cached) {
          if (cached.status === 'loaded') {
            setLoadingState('loaded')
            setCurrentSrc(src)
            setError(null)
            return Promise.resolve(new Image()) // 返回空图片对象，实际不使用
          } else if (cached.status === 'error' && cached.error) {
            setLoadingState('error')
            setError(cached.error)
            throw cached.error
          } else if (cached.status === 'loading' && cached.promise) {
            setLoadingState('loading')
            return cached.promise
          }
        }
      }

      setLoadingState('loading')
      setCurrentSrc(src)
      setError(null)
      onLoadStart?.()

      const loadPromise = createImageLoadPromise(src)
      loadingPromiseRef.current = loadPromise

      // 缓存Promise
      if (enableCache) {
        globalImageCache.set(src, 'loading', loadPromise)
      }

      try {
        const img = await loadPromise
        setLoadingState('loaded')
        setRetryCount(0)

        // 更新缓存
        if (enableCache) {
          globalImageCache.set(src, 'loaded')
        }

        onLoadEnd?.()
        return img
      } catch (err) {
        const error = err as Error
        setLoadingState('error')
        setError(error)

        // 更新缓存
        if (enableCache) {
          globalImageCache.set(src, 'error', undefined, error)
        }

        onError?.(error)
        throw error
      } finally {
        loadingPromiseRef.current = null
        abortControllerRef.current = null
      }
    },
    [enableCache, cacheTimeout, onLoadStart, onLoadEnd, onError]
  )

  // 预加载函数
  const preloadImage = useCallback(
    async (src: string): Promise<HTMLImageElement> => {
      // 检查是否已经加载或正在加载
      if (enableCache) {
        const cached = globalImageCache.get(src, cacheTimeout)
        if (
          cached &&
          (cached.status === 'loaded' || cached.status === 'loading')
        ) {
          return cached.promise || Promise.resolve(new Image())
        }
      }

      // 创建预加载Promise，不更新组件状态
      const preloadPromise = createImageLoadPromise(src)

      // 缓存预加载Promise
      if (enableCache) {
        globalImageCache.set(src, 'loading', preloadPromise)
      }

      try {
        const img = await preloadPromise
        if (enableCache) {
          globalImageCache.set(src, 'loaded')
        }
        return img
      } catch (err) {
        const error = err as Error
        if (enableCache) {
          globalImageCache.set(src, 'error', undefined, error)
        }
        throw error
      }
    },
    [enableCache, cacheTimeout]
  )

  // 重试函数
  const retryLoad = useCallback(async (): Promise<HTMLImageElement | null> => {
    if (!currentSrc || retryCount >= maxRetryCount) {
      return null
    }

    setRetryCount(prev => prev + 1)

    // 等待重试延迟
    await new Promise(resolve => setTimeout(resolve, retryDelay))

    try {
      return await loadImage(currentSrc)
    } catch (error) {
      // 如果达到最大重试次数，不再重试
      if (retryCount + 1 >= maxRetryCount) {
        console.warn(`Max retry count reached for image: ${currentSrc}`)
      }
      throw error
    }
  }, [currentSrc, retryCount, maxRetryCount, retryDelay, loadImage])

  // 重置函数
  const reset = useCallback(() => {
    // 取消当前加载
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 清理定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setLoadingState('idle')
    setCurrentSrc(null)
    setError(null)
    setRetryCount(0)
    loadingPromiseRef.current = null
  }, [])

  // 鼠标悬浮预加载处理
  const handleMouseEnter = useCallback(() => {
    if (preloadOnHover && currentSrc && loadingState === 'idle') {
      debounce(() => {
        preloadImage(currentSrc).catch(error => {
          console.warn('Preload on hover failed:', error)
        })
      }, debounceDelay)
    }
  }, [
    preloadOnHover,
    currentSrc,
    loadingState,
    preloadImage,
    debounce,
    debounceDelay,
  ])

  const handleMouseLeave = useCallback(() => {
    // 清理防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }, [])

  // 初始预加载
  useEffect(() => {
    if (preload && initialSrc) {
      loadImage(initialSrc).catch(error => {
        console.warn('Initial preload failed:', error)
      })
    }
  }, [preload, initialSrc, loadImage])

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 计算衍生状态
  const isLoading = loadingState === 'loading'
  const isLoaded = loadingState === 'loaded'
  const isError = loadingState === 'error'

  return {
    // 状态
    loadingState,
    isLoading,
    isLoaded,
    isError,

    // 方法
    load: loadImage,
    preload: preloadImage,
    retry: retryLoad,
    reset,

    // 事件处理器
    handleMouseEnter,
    handleMouseLeave,

    // 元数据
    currentSrc,
    error,
    retryCount,
  }
}

// 工具函数：清理全局缓存
export const clearImageCache = (src?: string) => {
  globalImageCache.clear(src)
}

// 工具函数：获取缓存大小
export const getImageCacheSize = () => {
  return globalImageCache.size()
}

export default useLazyImage
