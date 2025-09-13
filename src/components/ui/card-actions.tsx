import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// 卡片操作组件
interface CardActionsProps {
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: 'default' | 'primary' | 'secondary'
    external?: boolean
  }
  secondaryActions?: Array<{
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }>
  className?: string
}

export function CardActions({
  primaryAction,
  secondaryActions = [],
  className,
}: CardActionsProps) {
  const buttonBaseClasses =
    'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors'

  const getVariantClasses = (variant: string = 'default') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      default:
        return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
    }
  }

  // 渲染主要操作按钮
  const renderPrimaryAction = () => {
    if (!primaryAction) return null

    const classes = cn(
      buttonBaseClasses,
      getVariantClasses(primaryAction.variant)
    )

    if (primaryAction.href) {
      if (primaryAction.external) {
        return (
          <a
            href={primaryAction.href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {primaryAction.label}
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )
      }
      return (
        <Link href={primaryAction.href} className={classes}>
          {primaryAction.label}
        </Link>
      )
    }

    return (
      <button type="button" onClick={primaryAction.onClick} className={classes}>
        {primaryAction.label}
        <svg
          className="w-3 h-3 ml-1"
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
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* 次要操作按钮 */}
      {secondaryActions.map((action, index) => {
        const classes =
          'p-2 text-gray-400 hover:text-gray-600 transition-colors'
        const content = action.icon || (
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        )

        if (action.href) {
          const external = action.href.startsWith('http')
          return external ? (
            <a
              key={index}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={classes}
              title={action.label}
            >
              {content}
            </a>
          ) : (
            <Link
              key={index}
              href={action.href}
              className={classes}
              title={action.label}
            >
              {content}
            </Link>
          )
        }

        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={classes}
            title={action.label}
          >
            {content}
          </button>
        )
      })}

      {/* 主要操作按钮 */}
      {renderPrimaryAction()}
    </div>
  )
}
