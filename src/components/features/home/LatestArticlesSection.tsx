import Link from 'next/link'
import { getFeaturedArticles } from '@/lib/mock/articles'
import { Avatar } from '@/components/ui/avatar'

export default function LatestArticlesSection() {
  const featuredArticles = getFeaturedArticles()

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">最新Posts</h2>
            <p className="text-gray-600 mt-2">最新的文章、推荐和笔记分享</p>
          </div>
          <Link
            href="/posts"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.slice(0, 4).map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Avatar size="sm" theme="secondary">
                  {article.author.name.charAt(0)}
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">{article.author.name}</div>
                  <div className="text-xs text-gray-500">
                    {article.createdAt.toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>👀 {article.viewCount}</span>
                  <span>❤️ {article.likeCount}</span>
                  <span>💬 {article.commentCount}</span>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                  {article.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}