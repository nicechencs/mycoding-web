'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import {
  LoadingSpinner,
  PageLoader,
  ComponentLoader,
} from '@/components/ui/LoadingSuspense'

// 动态导入选项
export interface DynamicImportOptions {
  // 加载状态
  loading?: ComponentType<any>
  // 是否启用SSR
  ssr?: boolean
  // 错误处理
  onError?: (error: Error) => void
  // 延迟加载（毫秒）
  delay?: number
  // 超时时间（毫秒）
  timeout?: number
}

// 预设加载组件
export const loadingComponents = {
  page: () => React.createElement(PageLoader),
  component: () => React.createElement(ComponentLoader),
  spinner: () =>
    React.createElement(LoadingSpinner, { size: 'md', variant: 'spinner' }),
  skeleton: () =>
    React.createElement(LoadingSpinner, { size: 'md', variant: 'skeleton' }),
  dots: () =>
    React.createElement(LoadingSpinner, { size: 'sm', variant: 'dots' }),
} as const

// 工具函数：创建动态组件
export function createDynamicComponent<T = unknown>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const {
    loading = loadingComponents.component,
    ssr = true,
    onError,
    delay = 0,
    timeout = 10000,
  } = options

  // 包装导入函数以支持延迟和超时
  const wrappedImport = async () => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Dynamic import timeout after ${timeout}ms`))
      }, timeout)
    })

    try {
      const result = await Promise.race([importFn(), timeoutPromise])
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }

  return dynamic(wrappedImport, {
    loading: loading as any,
    ssr,
  })
}

// === 页面级动态组件 ===

// 文章相关页面
export const DynamicArticlesPage = createDynamicComponent(
  () => import('@/app/(main)/posts/articles/page'),
  { loading: loadingComponents.page }
)

export const DynamicArticleDetailPage = createDynamicComponent(
  () => import('@/app/(main)/posts/[slug]/page'),
  { loading: loadingComponents.page }
)

// 资源相关页面
export const DynamicResourcesPage = createDynamicComponent(
  () => import('@/app/(main)/resources/page'),
  { loading: loadingComponents.page }
)

export const DynamicResourceDetailPage = createDynamicComponent(
  () => import('@/app/(main)/resources/[slug]/page'),
  { loading: loadingComponents.page }
)

// 动态相关页面
export const DynamicVibesPage = createDynamicComponent(
  () => import('@/app/(main)/vibes/page'),
  { loading: loadingComponents.page }
)

export const DynamicVibeDetailPage = createDynamicComponent(
  () => import('@/app/(main)/vibes/[id]/page'),
  { loading: loadingComponents.page }
)

// 用户相关页面

export const DynamicSettingsPage = createDynamicComponent(
  () => import('@/app/(user)/settings/page'),
  { loading: loadingComponents.page }
)

// 认证页面
export const DynamicLoginPage = createDynamicComponent(
  () => import('@/app/(auth)/login/page'),
  { loading: loadingComponents.page, ssr: false }
)

export const DynamicRegisterPage = createDynamicComponent(
  () => import('@/app/(auth)/register/page'),
  { loading: loadingComponents.page, ssr: false }
)

// === 组件级动态组件 ===

// === 组件级动态导入（暂时注释，需要时再启用）===

// 功能组件 - 需要确保这些组件存在并且有正确的默认导出
// export const DynamicVibeComposer = createDynamicComponent(
//   () => import('@/components/features/vibes/vibe-composer'),
//   { loading: loadingComponents.skeleton }
// )

// export const DynamicResourceComments = createDynamicComponent(
//   () => import('@/components/features/resources/ResourceComments'),
//   { loading: loadingComponents.skeleton }
// )

// export const DynamicPostComments = createDynamicComponent(
//   () => import('@/components/features/posts/post-comments'),
//   { loading: loadingComponents.skeleton }
// )

// // 图表和数据可视化组件（通常较大）
// export const DynamicRatingDistribution = createDynamicComponent(
//   () => import('@/components/features/resources/rating-distribution'),
//   { loading: loadingComponents.skeleton }
// )

// === 高级动态导入工具 ===

// 条件动态导入
export function createConditionalDynamicComponent<T = unknown>(
  condition: boolean | (() => boolean),
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType<T>,
  options: DynamicImportOptions = {}
) {
  const shouldLoad = typeof condition === 'function' ? condition() : condition

  if (!shouldLoad && fallback) {
    return fallback
  }

  return createDynamicComponent(importFn, options)
}

// 延迟动态导入
export function createLazyDynamicComponent<T = unknown>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  triggerDelay: number = 1000,
  options: DynamicImportOptions = {}
) {
  return createDynamicComponent(importFn, {
    ...options,
    delay: triggerDelay,
  })
}

// 批量动态导入
export function createBatchDynamicComponents<T extends Record<string, any>>(
  imports: {
    [K in keyof T]: () => Promise<{ default: ComponentType<T[K]> }>
  },
  options: DynamicImportOptions = {}
): {
  [K in keyof T]: ComponentType<T[K]>
} {
  const result = {} as {
    [K in keyof T]: ComponentType<T[K]>
  }

  for (const [key, importFn] of Object.entries(imports)) {
    result[key as keyof T] = createDynamicComponent(importFn, options)
  }

  return result
}

// 预加载函数
export function preloadDynamicComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>
) {
  // 预加载组件，但不立即使用
  importFn().catch(error => {
    console.warn('Failed to preload dynamic component:', error)
  })
}

// 预加载多个组件
export function preloadDynamicComponents(
  importFns: Array<() => Promise<{ default: ComponentType<any> }>>
) {
  const promises = importFns.map(fn =>
    fn().catch(error => {
      console.warn('Failed to preload dynamic component:', error)
    })
  )

  return Promise.allSettled(promises)
}

// === 路由级预加载策略 ===
export class DynamicImportManager {
  private static preloadedComponents = new Set<string>()

  // 预加载首页组件
  static preloadHomeComponents() {
    if (typeof window === 'undefined') return

    const homeComponents = [
      () => import('@/components/features/home/HeroSection'),
      () => import('@/components/features/home/FeaturedResourcesSection'),
      () => import('@/components/features/home/LatestArticlesSection'),
      () => import('@/components/features/home/LatestVibesSection'),
    ]

    homeComponents.forEach((importFn, index) => {
      const componentId = `home-component-${index}`
      if (!this.preloadedComponents.has(componentId)) {
        // 延迟预加载，避免影响初始页面加载
        setTimeout(
          () => {
            preloadDynamicComponent(importFn)
            this.preloadedComponents.add(componentId)
          },
          2000 + index * 500
        )
      }
    })
  }

  // 预加载用户相关组件
  static preloadUserComponents() {
    if (typeof window === 'undefined') return

    const userComponents = [
      () => import('@/app/(user)/settings/page'),
      () => import('@/app/(user)/my-favorites/page'),
    ]

    preloadDynamicComponents(userComponents)
  }

  // 预加载编辑器组件（在用户可能需要时）
  static preloadEditorComponents() {
    if (typeof window === 'undefined') return

    // 暂时注释，需要确保组件存在
    // const editorComponents = [
    //   () => import('@/components/features/vibes/vibe-composer'),
    //   () => import('@/components/ui/markdown'),
    // ]

    // setTimeout(() => {
    //   preloadDynamicComponents(editorComponents)
    // }, 3000)

    console.log('Editor components preloading skipped - components not ready')
  }

  // 清理预加载记录
  static clearPreloadedComponents() {
    this.preloadedComponents.clear()
  }
}

export default DynamicImportManager
