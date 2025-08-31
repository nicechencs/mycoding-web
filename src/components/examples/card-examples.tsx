import React from 'react'
import { 
  BaseCard, 
  Card, 
  CardHeader, 
  CardContent, 
  CardStats,
  CardTags,
  CategoryBadge,
  ArticleStats,
  VibeStats,
  ResourceTags,
  ArticleTags,
  VibeTags,
  CardFooter,
  CardActions,
  Avatar,
  VibeContent,
  SimpleCardHeader,
  ArticleContent
} from '@/components/ui'
import { Resource, Article, Vibe } from '@/types'

// 示例数据
const sampleResource: Resource = {
  id: '1',
  title: 'React完整学习指南',
  description: '从基础入门到高级应用，全面学习React框架的各个知识点和最佳实践。',
  url: 'https://reactjs.org',
  category: '前端开发',
  tags: ['React', 'JavaScript', 'Frontend', 'Framework'],
  rating: 4.8,
  author: '张三',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-02-01'),
  featured: true
}

const sampleArticle: Article = {
  id: '1',
  title: '深入理解React Hooks的工作原理',
  content: '',
  excerpt: '本文将详细解释React Hooks的内部实现机制，帮助开发者更好地理解和使用这些强大的API。',
  slug: 'react-hooks-deep-dive',
  author: {
    id: '1',
    name: '李四',
    email: 'lisi@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  category: '前端开发',
  tags: ['React', 'Hooks', 'JavaScript'],
  viewCount: 1250,
  likeCount: 89,
  commentCount: 23,
  createdAt: new Date('2024-02-10'),
  updatedAt: new Date('2024-02-12'),
  featured: true
}

const sampleVibe: Vibe = {
  id: '1',
  content: '今天学习了React的新特性，感觉非常有趣！特别是Concurrent Features，真的能显著提升用户体验。估计接下来的项目都会用上这些新功能。 #React #前端开发 #学习笔记',
  author: {
    id: '1',
    name: '王五',
    email: 'wangwu@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  images: ['image1.jpg', 'image2.jpg'],
  tags: ['React', '前端开发', '学习笔记'],
  likeCount: 42,
  commentCount: 8,
  shareCount: 15,
  createdAt: new Date('2024-02-15T10:30:00'),
  isLiked: false
}

// 使用新组件重构后的ResourceCard
export function NewResourceCard({ resource }: { resource: Resource }) {
  return (
    <BaseCard variant="hover" className="group">
      {/* Header */}
      <SimpleCardHeader 
        category={resource.category}
        featured={resource.featured}
        rating={resource.rating}
        className="mb-4"
      />
      
      {/* Content */}
      <CardContent 
        title={resource.title}
        description={resource.description}
        titleSize="sm"
        descriptionLines={3}
        className="mb-4 group-hover:text-blue-600 transition-colors"
      />
      
      {/* Tags */}
      <ResourceTags 
        tags={resource.tags}
        maxVisible={3}
        className="mb-4"
      />
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Avatar size="xs" theme="tertiary">
            {resource.author.charAt(0)}
          </Avatar>
          <span className="text-sm text-gray-600">{resource.author}</span>
        </div>
        
        <CardActions 
          primaryAction={{
            label: '访问资源',
            href: resource.url,
            external: true
          }}
        />
      </div>
      
      {/* Footer */}
      <CardFooter 
        createdAt={resource.createdAt}
        updatedAt={resource.updatedAt}
        className="mt-3"
      />
    </BaseCard>
  )
}

// 使用新组件重构后的ArticleCard
export function NewArticleCard({ article }: { article: Article }) {
  return (
    <BaseCard variant="hover" className="group">
      {/* Header */}
      <CardHeader 
        author={article.author}
        timestamp={article.createdAt}
        category={article.category}
        featured={article.featured}
        size="md"
        layout="horizontal"
        className="mb-4"
      />
      
      {/* Content */}
      <ArticleContent 
        title={article.title}
        excerpt={article.excerpt}
        slug={article.slug}
        className="mb-4"
      />
      
      {/* Tags */}
      <ArticleTags 
        tags={article.tags}
        maxVisible={3}
        className="mb-4"
      />
      
      {/* Stats */}
      <ArticleStats 
        viewCount={article.viewCount}
        likeCount={article.likeCount}
        commentCount={article.commentCount}
        className="pt-4 border-t border-gray-100"
        rightContent={
          <CardActions 
            primaryAction={{
              label: '阅读全文',
              href: `/posts/${article.slug}`,
              variant: 'default'
            }}
          />
        }
      />
      
      {/* Footer */}
      <CardFooter 
        createdAt={article.createdAt}
        updatedAt={article.updatedAt}
        className="mt-3"
      />
    </BaseCard>
  )
}

// 使用新组件重构后的VibeCard  
export function NewVibeCard({ vibe }: { vibe: Vibe }) {
  const [isLiked, setIsLiked] = React.useState(vibe.isLiked || false)
  const [likeCount, setLikeCount] = React.useState(vibe.likeCount)
  const [showComments, setShowComments] = React.useState(false)
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }
  
  return (
    <BaseCard variant="hover">
      {/* Header */}
      <CardHeader 
        author={vibe.author}
        timestamp={vibe.createdAt}
        size="lg"
        layout="stacked"
        className="mb-4"
        rightContent={
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        }
      />
      
      {/* Content */}
      <VibeContent 
        content={vibe.content}
        images={vibe.images}
        className="mb-4"
      />
      
      {/* Tags */}
      {vibe.tags.length > 0 && (
        <VibeTags 
          tags={vibe.tags}
          className="mb-4"
        />
      )}
      
      {/* Stats */}
      <VibeStats 
        likeCount={likeCount}
        commentCount={vibe.commentCount}
        shareCount={vibe.shareCount}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={() => setShowComments(!showComments)}
        onShare={() => console.log('分享')}
        onBookmark={() => console.log('收藏')}
        className="pt-4 border-t border-gray-100"
      />
      
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {/* Comment Input */}
            <div className="flex space-x-3">
              <Avatar size="sm" theme="secondary">
                我
              </Avatar>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="写下你的评论..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Sample Comments */}
            {vibe.commentCount > 0 && (
              <div className="text-sm text-gray-500">
                暂无评论，成为第一个评论的人吧！
              </div>
            )}
          </div>
        </div>
      )}
    </BaseCard>
  )
}

// 示例页面组件
export function CardExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">卡片组件示例</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 资源卡片 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">资源卡片</h2>
          <NewResourceCard resource={sampleResource} />
        </div>
        
        {/* 文章卡片 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">文章卡片</h2>
          <NewArticleCard article={sampleArticle} />
        </div>
        
        {/* Vibe卡片 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Vibe卡片</h2>
          <NewVibeCard vibe={sampleVibe} />
        </div>
      </div>
    </div>
  )
}