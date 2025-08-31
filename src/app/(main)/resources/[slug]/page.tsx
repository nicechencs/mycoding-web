import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  getResourceBySlug, 
  getResourceComments, 
  getRelatedResources 
} from '@/lib/data/resources'
import { RatingStars } from '@/components/features/resources/rating-stars'
import { RatingDistribution } from '@/components/features/resources/rating-distribution'
import { ResourceComments } from '@/components/features/resources/resource-comments'
import { ResourceCard } from '@/components/features/resources/resource-card'
import { Avatar } from '@/components/ui/avatar'

interface ResourceDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resource = await getResourceBySlug(params.slug)
  
  if (!resource) {
    notFound()
  }
  
  const comments = await getResourceComments(resource.id)
  const relatedResources = await getRelatedResources(resource.id, 3)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/resources" className="text-gray-500 hover:text-gray-700">
              资源导航
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{resource.title}</span>
          </nav>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 资源信息卡片 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                      {resource.category}
                    </span>
                    {resource.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        精选
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {resource.title}
                  </h1>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Avatar size="xs" theme="secondary">
                        {resource.author.charAt(0)}
                      </Avatar>
                      <span>{resource.author}</span>
                    </div>
                    <span>发布于 {resource.createdAt.toLocaleDateString('zh-CN')}</span>
                    <span>{resource.viewCount.toLocaleString()} 次浏览</span>
                  </div>
                </div>
              </div>
              
              {/* 评分显示 */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <RatingStars rating={resource.rating} totalCount={resource.ratingCount} size="lg" />
                  <span className="text-gray-500">
                    基于 {resource.ratingCount.toLocaleString()} 个评分
                  </span>
                </div>
              </div>
              
              {/* 访问按钮 */}
              <div className="border-t pt-6">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  访问资源
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* 详细描述 */}
            {resource.detailedDescription && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">详细介绍</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {resource.detailedDescription}
                  </p>
                </div>
              </div>
            )}
            
            {/* 标签 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">相关标签</h2>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/resources?tag=${encodeURIComponent(tag)}`}
                    className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* 评论区 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ResourceComments 
                comments={comments}
                onAddComment={(content, parentId) => {
                  console.log('Add comment:', { content, parentId })
                  // 这里后续会连接到后端API
                }}
              />
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="space-y-8">
            {/* 评分分布 */}
            {resource.ratingDistribution && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">评分分布</h3>
                <RatingDistribution 
                  distribution={resource.ratingDistribution}
                  totalCount={resource.ratingCount}
                />
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">我要评分</h4>
                  <RatingStars 
                    rating={0}
                    interactive
                    showCount={false}
                    onRate={(rating) => {
                      console.log('User rating:', rating)
                      // 这里后续会连接到后端API
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* 统计信息 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">统计信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">浏览次数</span>
                  <span className="font-medium">{resource.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">收藏次数</span>
                  <span className="font-medium">{resource.likeCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">评论数量</span>
                  <span className="font-medium">{resource.commentCount.toLocaleString()}</span>
                </div>
                {resource.downloadCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">下载次数</span>
                    <span className="font-medium">{resource.downloadCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 分享功能 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">分享资源</h3>
              <div className="flex gap-3">
                <button className="flex-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="flex-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="flex-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 相关资源 */}
            {relatedResources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">相关资源</h3>
                <div className="space-y-4">
                  {relatedResources.map((relatedResource) => (
                    <ResourceCard key={relatedResource.id} resource={relatedResource} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}