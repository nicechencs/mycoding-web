'use client'

import Link from 'next/link'
import { getFeaturedResources } from '@/lib/mock/resources'
import { ResourceCard } from '@/components/features/resources/resource-card'

export default function FeaturedResourcesSection() {
  const featuredResources = getFeaturedResources()

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
        {featuredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
      </div>
    </section>
  )
}