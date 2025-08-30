import { Resource } from '@/types'

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '前端开发': 'bg-blue-100 text-blue-700',
      '后端开发': 'bg-green-100 text-green-700', 
      '数据库': 'bg-purple-100 text-purple-700',
      '移动开发': 'bg-orange-100 text-orange-700',
      '人工智能': 'bg-red-100 text-red-700',
      '云计算': 'bg-cyan-100 text-cyan-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium ml-1">{resource.rating}</span>
          </div>
          {resource.featured && (
            <div className="w-2 h-2 bg-red-500 rounded-full" title="精选资源"></div>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {resource.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {resource.description}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            #{tag}
          </span>
        ))}
        {resource.tags.length > 3 && (
          <span className="inline-block px-2 py-1 text-xs text-gray-500">
            +{resource.tags.length - 3} 更多
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {resource.author.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600">{resource.author}</span>
        </div>
        
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
        >
          访问资源
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>创建于 {resource.createdAt.toLocaleDateString('zh-CN')}</span>
        <span>更新于 {resource.updatedAt.toLocaleDateString('zh-CN')}</span>
      </div>
    </div>
  )
}