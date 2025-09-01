'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Resource } from '@/types/resource'
import { Avatar } from '@/components/ui/avatar'
import { RatingStars } from './rating-stars'
import { getCategoryClasses } from '@/lib/utils/category'
import { Markdown } from '@/components/ui/markdown'

interface ResourceCardProps {
  resource: Resource
}

export const ResourceCard = React.memo(({ resource }: ResourceCardProps) => {
  const router = useRouter()

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // 阻止点击特定元素时触发卡片跳转
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button') || target.closest('[data-no-click]')) {
      return
    }
    // 跳转到资源详情页
    router.push(`/resources/${resource.slug}`)
  }, [router, resource.slug])

  return (
    <div 
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer transform hover:-translate-y-1 relative"
      onClick={handleCardClick}
    >
      {/* 精选书签 */}
      {resource.featured && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md transform rotate-12 z-10">
          精
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryClasses(resource.category)}`}>
          {resource.category}
        </span>
        <div className="flex items-center space-x-2">
          <RatingStars 
            rating={resource.rating} 
            totalCount={resource.ratingCount}
            size="sm"
            showCount={false}
          />
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {resource.title}
      </h3>
      
      <div className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed prose-sm prose-gray max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <Markdown className="[&_p]:mb-0 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_ul]:my-0 [&_ol]:my-0">
          {resource.description}
        </Markdown>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            data-no-click
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
          <Avatar size="xs" theme="tertiary">
            {resource.author.charAt(0)}
          </Avatar>
          <span className="text-sm text-gray-600">{resource.author}</span>
        </div>
        
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
          data-no-click
        >
          查看详情
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {resource.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {resource.commentCount}
          </span>
        </div>
        <span className="text-yellow-500 font-medium">{resource.rating.toFixed(1)}</span>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数：只在关键属性变化时重新渲染
  const prev = prevProps.resource
  const next = nextProps.resource
  
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.rating === next.rating &&
    prev.viewCount === next.viewCount &&
    prev.commentCount === next.commentCount &&
    prev.featured === next.featured &&
    prev.slug === next.slug
  )
})