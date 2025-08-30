import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50/80 backdrop-blur-sm py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💻</span>
              <span className="font-bold text-lg text-blue-600">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              现代化编程学习平台，集资源导航、社区交流、动态分享于一体。
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">快速导航</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-blue-600 transition-colors">
                  资源导航
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-blue-600 transition-colors">
                  社区文章
                </Link>
              </li>
              <li>
                <Link href="/vibes" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Vibe动态
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">技术分类</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-600">前端开发</span>
              </li>
              <li>
                <span className="text-gray-600">后端开发</span>
              </li>
              <li>
                <span className="text-gray-600">移动开发</span>
              </li>
              <li>
                <span className="text-gray-600">人工智能</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">联系我们</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={siteConfig.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-gray-600">邮箱: hello@mycoding-web.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. 保留所有权利。
            </p>
            <p className="text-sm text-gray-500">
              基于 Next.js 14 构建
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}