import Link from 'next/link'
import { getFeaturedResources } from '@/lib/mock/resources'

export default function FeaturedResourcesSection() {
  const featuredResources = getFeaturedResources()

  return (
    <section className="container">
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
          <div
            key={resource.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {resource.category}
              </span>
              <div className="flex items-center text-yellow-500">
                <span className="text-sm">★</span>
                <span className="text-sm ml-1">{resource.rating}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {resource.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{resource.author}</span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                访问资源 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}