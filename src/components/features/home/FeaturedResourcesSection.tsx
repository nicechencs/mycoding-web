'use client'

import Link from 'next/link'
import { useFeaturedResources } from '@/hooks/use-resources'
import { ResourceCard } from '@/components/features/resources/resource-card'
import { ListSkeleton } from '@/components/ui/LoadingSuspense'

export default function FeaturedResourcesSection() {
  const { resources, loading, error } = useFeaturedResources(6)

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选资源</h2>
              <p className="text-gray-600 mt-2">发现优质的编程学习资源</p>
            </div>
            <Link
              href="/resources"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <ListSkeleton items={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选资源</h2>
              <p className="text-gray-600 mt-2">发现优质的编程学习资源</p>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">获取精选资源失败，请稍后重试</p>
          </div>
        </div>
      </section>
    )
  }

  if (!resources || resources.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选资源</h2>
              <p className="text-gray-600 mt-2">发现优质的编程学习资源</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">暂无精选资源</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">精选资源</h2>
            <p className="text-gray-600 mt-2">发现优质的编程学习资源</p>
          </div>
          <Link
            href="/resources"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  )
}
