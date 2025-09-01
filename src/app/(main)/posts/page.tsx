'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getFeaturedArticles, getLatestArticles } from '@/lib/mock/articles'
import { Avatar } from '@/components/ui/avatar'

export default function PostsPage() {
  const featuredArticles = getFeaturedArticles()
  const latestArticles = getLatestArticles()
  const router = useRouter()

  const handleCardClick = (slug: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    router.push(`/posts/${slug}`)
  }

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="container">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">文章</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            分享你的技术文章、项目推荐、学习心得和博客内容
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/posts/articles"
            className="btn-primary px-8 py-3 text-base font-semibold"
          >
            浏览文章
          </Link>
          <button className="btn-secondary px-8 py-3 text-base font-semibold">
            写文章
          </button>
          <button className="btn-secondary px-8 py-3 text-base font-semibold">
            发布推荐
          </button>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">精选内容</h2>
            <p className="text-gray-600 mt-2">编辑推荐的优质文章和内容</p>
          </div>
          <Link
            href="/posts/articles"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => handleCardClick(article.slug, e)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Avatar size="md" theme="secondary">
                  {article.author.name.charAt(0)}
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">{article.author.name}</div>
                  <div className="text-sm text-gray-500">
                    {article.createdAt.toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span>👀</span>
                    <span>{article.viewCount}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>{article.likeCount}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{article.commentCount}</span>
                  </span>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                  {article.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/posts/${article.slug}`}
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                阅读全文
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">最新发布</h2>
              <p className="text-gray-600 mt-2">最新的文章、推荐和博客内容</p>
            </div>
            <Link
              href="/posts/articles"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              查看更多 →
            </Link>
          </div>

          <div className="space-y-4">
            {latestArticles.slice(0, 8).map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => handleCardClick(article.slug, e)}
              >
                <div className="flex items-start space-x-4">
                  <Avatar size="lg" theme="tertiary">
                    {article.author.name.charAt(0)}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{article.author.name}</span>
                      <span className="text-sm text-gray-500">
                        {article.createdAt.toLocaleDateString('zh-CN')}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-purple-600 transition-colors">
                      <Link href={`/posts/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👀 {article.viewCount}</span>
                        <span>❤️ {article.likeCount}</span>
                        <span>💬 {article.commentCount}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Stats */}
      <section className="container">
        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">开始创作</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            分享你的知识和经验，帮助更多开发者成长。写文章、发推荐、记录成长。
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold">1,234</div>
              <div className="text-purple-200 text-sm">创作者</div>
            </div>
            <div>
              <div className="text-3xl font-bold">567</div>
              <div className="text-purple-200 text-sm">技术文章</div>
            </div>
            <div>
              <div className="text-3xl font-bold">89</div>
              <div className="text-purple-200 text-sm">项目推荐</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2.1k</div>
              <div className="text-purple-200 text-sm">博客内容</div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              写文章
            </button>
            <button className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors">
              发布推荐
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}