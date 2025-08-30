import Link from 'next/link'

export default function FeaturesSection() {
  return (
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
  )
}