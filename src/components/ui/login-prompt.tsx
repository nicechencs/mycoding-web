'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LoginPromptProps {
  message?: string
  actionText?: string
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  onLoginClick?: () => void
}

export function LoginPrompt({
  message = '登录后即可使用此功能',
  actionText = '立即登录',
  className = '',
  showIcon = true,
  size = 'md',
  onLoginClick,
}: LoginPromptProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick()
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <div
      className={`
      bg-blue-50 border border-blue-200 rounded-lg
      ${sizeClasses[size]}
      ${className}
    `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showIcon && (
            <div className="flex-shrink-0">
              <svg
                className={`${iconSizeClasses[size]} text-blue-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
          <div>
            <p className="text-blue-800 font-medium">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoginClick}
            className="
              inline-flex items-center gap-1 px-3 py-1.5
              bg-blue-600 text-white text-sm font-medium rounded-md
              hover:bg-blue-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            {actionText}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            onClick={handleDismiss}
            className="
              text-blue-400 hover:text-blue-600 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
            "
            aria-label="关闭提示"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// 轻量级登录提示组件（用于按钮等小空间）
export function LoginPromptTooltip({
  children,
  message = '登录后可使用',
  className = '',
}: {
  children: React.ReactNode
  message?: string
  className?: string
}) {
  return (
    <div className={`group relative ${className}`}>
      {children}
      <div
        className="
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        bg-gray-900 text-white text-xs rounded-md px-2 py-1
        whitespace-nowrap z-10 pointer-events-none
      "
      >
        {message}
        <div
          className="
          absolute top-full left-1/2 transform -translate-x-1/2
          border-4 border-transparent border-t-gray-900
        "
        />
      </div>
    </div>
  )
}

// 内联登录提示组件（用于需要替换内容的场景）
export function LoginPromptInline({
  message = '请登录后使用此功能',
  actionText = '登录',
  onLoginClick,
  className = '',
}: {
  message?: string
  actionText?: string
  onLoginClick?: () => void
  className?: string
}) {
  return (
    <div
      className={`
      flex items-center justify-center gap-2
      text-sm text-gray-600 
      ${className}
    `}
    >
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span>{message}</span>
      <button
        onClick={onLoginClick}
        className="
          text-blue-600 hover:text-blue-800 font-medium
          transition-colors underline
        "
      >
        {actionText}
      </button>
    </div>
  )
}

// 模态框式登录提示
export function LoginPromptModal({
  isOpen,
  onClose,
  onLoginClick,
  title = '需要登录',
  message = '此功能需要您先登录账户',
  actionText = '立即登录',
  cancelText = '取消',
}: {
  isOpen: boolean
  onClose: () => void
  onLoginClick: () => void
  title?: string
  message?: string
  actionText?: string
  cancelText?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div
        className="
        relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4
        animate-in zoom-in-95 duration-200
      "
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="
                px-4 py-2 text-sm font-medium text-gray-700
                border border-gray-300 rounded-md
                hover:bg-gray-50 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onLoginClick()
                onClose()
              }}
              className="
                px-4 py-2 text-sm font-medium text-white
                bg-blue-600 border border-transparent rounded-md
                hover:bg-blue-700 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
