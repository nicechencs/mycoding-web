'use client'

import React, { useState } from 'react'
import { Resource } from '@/types/resource'
import { Avatar } from '@/components/ui/avatar'
import { RatingStars } from './rating-stars'
import { ProfilePreviewModal } from '@/components/features/user/profile-preview'
import { getCategoryClasses } from '@/lib/utils/category'
import { Markdown } from '@/components/ui/markdown'
import { useResourceCard } from '@/hooks/use-resource-card'
import {
  ResourceStats,
  createStatsConfig,
} from '@/components/ui/resource-stats'

interface ResourceCardProps {
  resource: Resource
}

export const ResourceCard = React.memo(
  ({ resource }: ResourceCardProps) => {
    const { handleCardClick, handleActionClick } = useResourceCard(resource)
    const [showProfile, setShowProfile] = useState(false)

    return (
      <>
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
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryClasses(resource.category)}`}
            >
              {resource.category}
            </span>
            <div className="flex items-center space-x-2">
              <RatingStars
                rating={resource.rating}
                totalCount={resource.ratingCount}
                size="sm"
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
            {resource.tags.slice(0, 3).map(tag => (
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
              <div
                role="button"
                aria-label="查看作者资料"
                onClick={e => {
                  e.stopPropagation()
                  setShowProfile(true)
                }}
                className="focus:outline-none rounded-full"
              >
                <Avatar size="xs" theme="tertiary">
                  {resource.author.charAt(0)}
                </Avatar>
              </div>
              <button
                className="text-sm text-gray-600 hover:text-blue-600"
                onClick={e => {
                  e.stopPropagation()
                  setShowProfile(true)
                }}
              >
                {resource.author}
              </button>
            </div>

            <button
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              onClick={handleActionClick}
            >
              查看详情
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <ResourceStats
              stats={createStatsConfig('resource', {
                viewCount: Number(resource.viewCount).toLocaleString(
                  'en-US'
                ) as any,
                commentCount: Number(resource.commentCount).toLocaleString(
                  'en-US'
                ) as any,
                onComment: e => {
                  e.stopPropagation()
                  // 这里可以添加评论相关逻辑，暂时保留原有行为
                },
              })}
              variant="default"
              size="xs"
              className="text-gray-500"
              interactive={false}
            />
          </div>
        </div>
        {/* 个人资料预览（资源作者名称仅字符串，无ID） */}
        <ProfilePreviewModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          name={resource.author}
        />
      </>
    )
  },
  // 简化的memo比较：只比较resource对象的引用
  // 如果resource对象没有变化，则不重新渲染
  // 这比之前的深度比较更加高效
  (prevProps, nextProps) => prevProps.resource === nextProps.resource
)
