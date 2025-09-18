// Server Component by default
import dynamic from 'next/dynamic'
import { LoadingSuspense, ComponentLoader } from '@/components/ui/LoadingSuspense'
import { HeroSection } from '@/components/features/home' // 保持Hero部分同步加载，因为是首屏内容
import Preloader from '@/components/features/home/Preloader'

// 动态导入非首屏组件（启用 Suspense，由外层 LoadingSuspense 提供 fallback）
const DynamicFeaturesSection = dynamic(
  () => import('@/components/features/home/FeaturesSection'),
  { ssr: true, suspense: true }
)

const DynamicFeaturedResourcesSection = dynamic(
  () => import('@/components/features/home/FeaturedResourcesSection'),
  { ssr: true, suspense: true }
)

const DynamicLatestArticlesSection = dynamic(
  () => import('@/components/features/home/LatestArticlesSection'),
  { ssr: true, suspense: true }
)

const DynamicLatestVibesSection = dynamic(
  () => import('@/components/features/home/LatestVibesSection'),
  { ssr: true, suspense: true }
)

export default function HomePage() {
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
      {/* 空闲时预加载用户相关页面（客户端） */}
      <Preloader />
    </div>
  )
}
