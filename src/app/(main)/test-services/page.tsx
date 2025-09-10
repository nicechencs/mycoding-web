'use client'

import { useState } from 'react'
import { useArticles, useFeaturedResources, useLatestVibes, useCurrentUser } from '@/hooks'

/**
 * 测试新数据服务架构的页面
 * 展示所有核心功能：文章、资源、动态、用户数据获取
 */
export default function TestServicesPage() {
  const [articlesPage, setArticlesPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  // 测试文章服务
  const { 
    articles, 
    loading: articlesLoading, 
    error: articlesError,
    pagination 
  } = useArticles({
    page: articlesPage,
    limit: 5,
    search: searchQuery
  })

  // 测试资源服务
  const { 
    resources, 
    loading: resourcesLoading, 
    error: resourcesError 
  } = useFeaturedResources(4)

  // 测试动态服务
  const { 
    vibes, 
    loading: vibesLoading, 
    error: vibesError 
  } = useLatestVibes(5)

  // 测试用户服务
  const { 
    user, 
    loading: userLoading, 
    error: userError 
  } = useCurrentUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">数据服务架构测试</h1>
      
      {/* 当前用户信息 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">当前用户</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {userLoading && <div>加载用户信息中...</div>}
          {userError && <div className="text-red-500">错误: {userError}</div>}
          {user && (
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || '/default-avatar.jpg'}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 文章列表测试 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">文章列表 (带搜索和分页)</h2>
        
        {/* 搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {articlesLoading && <div>加载文章中...</div>}
          {articlesError && <div className="text-red-500">错误: {articlesError}</div>}
          {articles.length > 0 && (
            <div>
              {articles.map((article) => (
                <div key={article.id} className="border-b border-gray-200 last:border-b-0 pb-4 mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>作者: {article.author.name}</span>
                    <span>{article.viewCount} 次浏览</span>
                  </div>
                  <div className="mt-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* 分页控制 */}
              {pagination && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setArticlesPage(Math.max(1, articlesPage - 1))}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  >
                    上一页
                  </button>
                  <span>
                    第 {pagination.page} 页，共 {pagination.totalPages} 页
                  </span>
                  <button
                    onClick={() => setArticlesPage(articlesPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  >
                    下一页
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 精选资源测试 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">精选资源</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {resourcesLoading && <div>加载资源中...</div>}
          {resourcesError && <div className="text-red-500">错误: {resourcesError}</div>}
          {resources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>评分: {resource.rating}/5</span>
                    <span>{resource.viewCount} 次浏览</span>
                  </div>
                  <div className="mt-2">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 最新动态测试 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">最新动态</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {vibesLoading && <div>加载动态中...</div>}
          {vibesError && <div className="text-red-500">错误: {vibesError}</div>}
          {vibes.length > 0 && (
            <div className="space-y-4">
              {vibes.map((vibe) => (
                <div key={vibe.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <img
                      src={vibe.author.avatar || '/default-avatar.jpg'}
                      alt={vibe.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{vibe.author.name}</span>
                        <span className="text-gray-500 text-sm">
                          {vibe.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mb-2">{vibe.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👍 {vibe.likeCount}</span>
                        <span>💬 {vibe.commentCount}</span>
                        <span>🔁 {vibe.shareCount}</span>
                      </div>
                      <div className="mt-2">
                        {vibe.tags.map((tag) => (
                          <span key={tag} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 架构信息 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">架构信息</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">数据来源</h3>
              <p className="text-sm text-gray-600">
                当前运行在 <strong>开发模式</strong>，使用 Mock 数据
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">技术栈</h3>
              <ul className="text-sm text-gray-600">
                <li>• SWR 数据获取和缓存</li>
                <li>• TypeScript 类型安全</li>
                <li>• 智能缓存管理</li>
                <li>• 环境适配</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}