'use client'

import Link from 'next/link'
import { useFeaturedArticles, useLatestArticles } from '@/hooks/use-articles'
import { ArticleCard } from '@/components/features/community/article-card'
import { ListSkeleton, PageLoader } from '@/components/ui/LoadingSuspense'

export default function PostsPage() {
  const {
    articles: featuredArticles,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedArticles(6)
  const {
    articles: latestArticles,
    loading: latestLoading,
    error: latestError,
  } = useLatestArticles(8)

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
          <Link
            href="/posts/new"
            className="btn-secondary px-8 py-3 text-base font-semibold"
          >
            写文章
          </Link>
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
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        {featuredLoading ? (
          <ListSkeleton
            items={6}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        ) : featuredError ? (
          <div className="text-center py-12">
            <p className="text-red-600">获取精选内容失败</p>
          </div>
        ) : featuredArticles && featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">暂无精选内容</p>
          </div>
        )}
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
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              查看更多 →
            </Link>
          </div>

          {latestLoading ? (
            <div className="space-y-4">
              <ListSkeleton items={8} className="space-y-4" />
            </div>
          ) : latestError ? (
            <div className="text-center py-12">
              <p className="text-red-600">获取最新发布失败</p>
            </div>
          ) : latestArticles && latestArticles.length > 0 ? (
            <div className="space-y-4">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">暂无最新发布</p>
            </div>
          )}
        </div>
      </section>

      {/* Content Stats */}
      <section className="container">
        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">开始创作</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            分享你的知识和经验，帮助更多开发者成长。写文章、发推荐、记录成长。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold">1,234</div>
              <div className="text-blue-200 text-sm">创作者</div>
            </div>
            <div>
              <div className="text-3xl font-bold">567</div>
              <div className="text-blue-200 text-sm">技术文章</div>
            </div>
            <div>
              <div className="text-3xl font-bold">89</div>
              <div className="text-blue-200 text-sm">项目推荐</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2.1k</div>
              <div className="text-blue-200 text-sm">博客内容</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/posts/new"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
            >
              写文章
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
