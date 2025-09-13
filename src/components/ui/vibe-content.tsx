import React from 'react'
import { cn } from '@/lib/utils'

// Vibe内容组件
interface VibeContentProps {
  content: string
  images?: string[]
  className?: string
  maxImages?: number
}

export function VibeContent({
  content,
  images = [],
  className,
  maxImages = 4,
}: VibeContentProps) {
  // 提取话题标签
  const renderContent = () => {
    const parts = content.split(/(#[\w\u4e00-\u9fa5]+)/g)

    return (
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {parts.map((part, index) => {
          if (part.startsWith('#')) {
            return (
              <span
                key={index}
                className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
              >
                {part}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </p>
    )
  }

  const displayImages = images.slice(0, maxImages)
  const remainingCount = Math.max(0, images.length - maxImages)

  return (
    <div className={cn('space-y-3', className)}>
      {/* 文本内容 */}
      {renderContent()}

      {/* 图片内容 */}
      {displayImages.length > 0 && (
        <div className="space-y-2">
          {displayImages.length === 1 ? (
            // 单张图片布局
            <div className="relative rounded-lg overflow-hidden max-w-md">
              <img
                src={displayImages[0]}
                alt="Vibe image"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ) : displayImages.length === 2 ? (
            // 两张图片布局
            <div className="grid grid-cols-2 gap-2">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Vibe image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : displayImages.length === 3 ? (
            // 三张图片布局
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={displayImages[0]}
                  alt="Vibe image 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {displayImages.slice(1).map((image, index) => (
                  <div
                    key={index + 1}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Vibe image ${index + 2}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // 四张及以上图片布局
            <div className="grid grid-cols-2 gap-2">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Vibe image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* 显示剩余数量 */}
                  {index === maxImages - 1 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ArticleContent 组件
interface ArticleContentProps {
  title: string
  excerpt: string
  slug: string
  className?: string
}

export function ArticleContent({
  title,
  excerpt,
  slug,
  className,
}: ArticleContentProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
        {title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
        {excerpt}
      </p>
    </div>
  )
}
