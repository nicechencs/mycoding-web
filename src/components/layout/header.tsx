'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteConfig, navConfig } from '@/lib/config'
import { useAuth } from '@/hooks/use-auth'
import { useNavigationHandler } from '@/hooks/use-navigation-handler'
 

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { isAuthenticated, user, logout } = useAuth()

  // 桌面端导航处理
  const desktopNavigation = useNavigationHandler({
    platform: 'desktop',
  })

  // 移动端导航处理
  const mobileNavigation = useNavigationHandler({
    platform: 'mobile',
    onNavigate: () => setMobileMenuOpen(false),
  })

  const handleLogout = async () => {
    try {
      await logout()
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">💻</span>
            <span className="inline-block font-bold text-xl text-blue-600">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          {navConfig.mainNav?.length ? (
            <nav className="hidden md:flex gap-6">
              {navConfig.mainNav?.map(
                (item, index) =>
                  item.href && (
                    <Link
                      key={index}
                      href={item.href}
                      className={desktopNavigation.getNavigationClassName(
                        item.href,
                        'flex items-center text-sm font-medium transition-colors hover:text-blue-600',
                        'text-blue-600 font-semibold'
                      )}
                    >
                      {item.title}
                    </Link>
                  )
              )}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-4">
          {/* 认证相关UI */}
          {isAuthenticated ? (
            /* 已登录状态 - 用户菜单 */
            <div className="relative" data-testid="user-menu">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="user-menu-button"
                aria-label="打开用户菜单"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 用户下拉菜单 */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              )}
              
            </div>
          ) : (
            /* 未登录状态 - 登录注册文本菜单 */
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                注册
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换菜单"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <nav className="container py-4 space-y-2" data-testid="mobile-nav">
            {navConfig.mainNav?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={mobileNavigation.getNavigationClassName(
                      item.href,
                      'block py-2 text-sm font-medium transition-colors hover:text-blue-600',
                      'text-blue-600 font-semibold'
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}

            {/* 移动端认证菜单 */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-blue-600">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <Link
                    href="/settings"
                    className="block py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="block py-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors border-t border-gray-100 mt-2 pt-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
