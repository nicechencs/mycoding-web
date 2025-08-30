import Link from 'next/link'
import { getFeaturedResources } from '@/lib/mock/resources'
import { getFeaturedArticles } from '@/lib/mock/articles'
import { getLatestVibes } from '@/lib/mock/vibes'

export default function HomePage() {
  const featuredResources = getFeaturedResources()
  const featuredArticles = getFeaturedArticles()
  const latestVibes = getLatestVibes(3)

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyCoding Web
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            现代化编程学习平台，集<span className="font-semibold text-blue-600">资源导航</span>、
            <span className="font-semibold text-purple-600">内容创作</span>、
            <span className="font-semibold text-green-600">动态分享</span>于一体
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Next.js 14</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Tailwind CSS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/resources"
              className="btn-primary px-8 py-3 text-base font-semibold"
            >
              探索资源
            </Link>
            <Link
              href="/posts"
              className="btn-secondary px-8 py-3 text-base font-semibold"
            >
              发布内容
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">核心功能</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为开发者打造的一站式学习和交流平台
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">资源导航</h3>
            <p className="text-gray-600 mb-4">
              精选优质编程资源，涵盖前端、后端、移动端、AI等各个领域
            </p>
            <Link href="/resources" className="text-blue-600 hover:text-blue-700 font-medium">
              查看资源 →
            </Link>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Posts内容</h3>
            <p className="text-gray-600 mb-4">
              写技术文章、发项目推荐、记录学习笔记，分享你的编程心得
            </p>
            <Link href="/posts" className="text-purple-600 hover:text-purple-700 font-medium">
              开始创作 →
            </Link>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vibe动态</h3>
            <p className="text-gray-600 mb-4">
              快速分享编程想法、学习心得，记录你的编程生活点滴
            </p>
            <Link href="/vibes" className="text-green-600 hover:text-green-700 font-medium">
              查看动态 →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">精选资源</h2>
            <p className="text-gray-600 mt-2">发现优质的编程学习资源</p>
          </div>
          <Link
            href="/resources"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {resource.category}
                </span>
                <div className="flex items-center text-yellow-500">
                  <span className="text-sm">★</span>
                  <span className="text-sm ml-1">{resource.rating}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {resource.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{resource.author}</span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  访问资源 →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {article.author.name.charAt(0)}
                  </div>
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

      {/* Latest Vibes */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
            <p className="text-gray-600 mt-2">社区成员的编程生活分享</p>
          </div>
          <Link
            href="/vibes"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        <div className="space-y-6">
          {latestVibes.map((vibe) => (
            <div
              key={vibe.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {vibe.author.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{vibe.author.name}</span>
                    <span className="text-sm text-gray-500">
                      {vibe.createdAt.toLocaleDateString('zh-CN')} {vibe.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{vibe.content}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <button className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${vibe.isLiked ? 'text-red-500' : ''}`}>
                      <span>❤️</span>
                      <span>{vibe.likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <span>💬</span>
                      <span>{vibe.commentCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <span>🔄</span>
                      <span>{vibe.shareCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}