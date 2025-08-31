'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Article } from '@/types'
import { Avatar } from '@/components/ui/avatar'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter()
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

  const handleCardClick = (e: React.MouseEvent) => {
    // 阻止点击特定元素时触发卡片跳转
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button') || target.closest('[data-no-click]')) {
      return
    }
    router.push(`/posts/${article.slug}`)
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar size="md" theme="secondary">
          {article.author.name.charAt(0)}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{article.author.name}</div>
          <div className="text-sm text-gray-500">
            {article.createdAt.toLocaleDateString('zh-CN')}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          {article.featured && (
            <div className="w-2 h-2 bg-red-500 rounded-full" title="精选文章"></div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-purple-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            data-no-click
          >
            #{tag}
          </span>
        ))}
        {article.tags.length > 3 && (
          <span className="inline-block px-2 py-1 text-xs text-gray-500">
            +{article.tags.length - 3} 更多
          </span>
        )}
      </div>
      
      {/* Stats and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer" data-no-click>
            <span>👀</span>
            <span>{article.viewCount}</span>
          </span>
          <span className="flex items-center space-x-1 hover:text-red-600 transition-colors cursor-pointer" data-no-click>
            <span>❤️</span>
            <span>{article.likeCount}</span>
          </span>
          <span className="flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer" data-no-click>
            <span>💬</span>
            <span>{article.commentCount}</span>
          </span>
        </div>
        
        <Link
          href={`/posts/${article.slug}`}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm hover:bg-purple-50 px-2 py-1 rounded transition-colors"
        >
          阅读全文
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* Time info */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>发布于 {article.createdAt.toLocaleDateString('zh-CN')}</span>
        {article.updatedAt.getTime() !== article.createdAt.getTime() && (
          <span>更新于 {article.updatedAt.toLocaleDateString('zh-CN')}</span>
        )}
      </div>
    </div>
  )
}