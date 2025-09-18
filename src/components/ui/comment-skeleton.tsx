'use client'

interface CommentSkeletonProps {
  count?: number
  showReplies?: boolean
}

export function CommentSkeleton({
  count = 3,
  showReplies = false,
}: CommentSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* 主评论骨架 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              {/* 评论内容区域 */}
              <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>

              {/* 交互按钮骨架 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-6"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>

              {/* 回复骨架（如果启用） */}
              {showReplies && index < 2 && (
                <div className="ml-12 space-y-3">
                  {[...Array(Math.max(1, Math.floor(Math.random() * 3)))].map(
                    (_, replyIndex) => (
                      <div key={replyIndex} className="flex gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                              <div className="h-3 bg-gray-200 rounded w-12"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded w-4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CommentInputSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-20 bg-gray-100 rounded-lg"></div>
          <div className="flex justify-end">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommentHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  )
}
