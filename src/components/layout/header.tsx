'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { siteConfig, navConfig } from '@/lib/config'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
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
                      className={`flex items-center text-sm font-medium transition-colors hover:text-blue-600 ${
                        pathname === item.href
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.title}
                    </Link>
                  )
              )}
            </nav>
          ) : null}
        </div>

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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <nav className="container py-4 space-y-2">
            {navConfig.mainNav?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={`block py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === item.href
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}