'use client'

import { useEffect } from 'react'
import {
  createDynamicComponent,
  DynamicImportManager,
} from '@/lib/utils/dynamic-imports'
import {
  LoadingSuspense,
  PageLoader,
  ComponentLoader,
} from '@/components/ui/LoadingSuspense'
import { HeroSection } from '@/components/features/home' // 保持Hero部分同步加载，因为是首屏内容

// 动态导入非首屏组件
const DynamicFeaturesSection = createDynamicComponent(
  () => import('@/components/features/home/FeaturesSection'),
  { loading: () => <ComponentLoader text="功能介绍加载中..." /> }
)

const DynamicFeaturedResourcesSection = createDynamicComponent(
  () => import('@/components/features/home/FeaturedResourcesSection'),
  { loading: () => <ComponentLoader text="精选资源加载中..." /> }
)

const DynamicLatestArticlesSection = createDynamicComponent(
  () => import('@/components/features/home/LatestArticlesSection'),
  { loading: () => <ComponentLoader text="最新文章加载中..." /> }
)

const DynamicLatestVibesSection = createDynamicComponent(
  () => import('@/components/features/home/LatestVibesSection'),
  { loading: () => <ComponentLoader text="最新动态加载中..." /> }
)

export default function HomePage() {
  // 预加载相关组件
  useEffect(() => {
    // 预加载用户可能访问的组件
    DynamicImportManager.preloadUserComponents()
    DynamicImportManager.preloadEditorComponents()
  }, [])

  return (
    <div className="space-y-0">
      {/* 首屏内容保持同步加载 */}
      <HeroSection />

      {/* 非首屏内容使用懒加载 */}
      <LoadingSuspense
        fallback={<ComponentLoader text="功能介绍加载中..." />}
        errorBoundary
      >
        <DynamicFeaturesSection />
      </LoadingSuspense>

      <LoadingSuspense
        fallback={<ComponentLoader text="精选资源加载中..." />}
        errorBoundary
      >
        <DynamicFeaturedResourcesSection />
      </LoadingSuspense>

      <LoadingSuspense
        fallback={<ComponentLoader text="最新文章加载中..." />}
        errorBoundary
      >
        <DynamicLatestArticlesSection />
      </LoadingSuspense>

      <LoadingSuspense
        fallback={<ComponentLoader text="最新动态加载中..." />}
        errorBoundary
      >
        <DynamicLatestVibesSection />
      </LoadingSuspense>
    </div>
  )
}
