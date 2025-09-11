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
  className 
}: CardActionsProps) {
  const buttonBaseClasses = "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors"
  
  const getVariantClasses = (variant: string = 'default') => {
    switch (variant) {
      case 'primary':
        return "bg-blue-600 text-white hover:bg-blue-700"
      case 'secondary':
        return "bg-gray-100 text-gray-700 hover:bg-gray-200"
      default:
        return "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    }
  }

  // 提取ActionComponent类型判断逻辑
  const getActionComponent = (action: { href?: string; external?: boolean }) => {
    if (!action.href) return 'button'
    return action.external ? 'a' : Link
  }

  // 提取action属性构造逻辑
  const getActionProps = (action: { href?: string; external?: boolean; onClick?: () => void }) => {
    if (action.href) {
      return {
        href: action.href,
        ...(action.external && { target: '_blank', rel: 'noopener noreferrer' })
      }
    }
    return {
      onClick: action.onClick,
      type: 'button' as const
    }
  }

  // 渲染主要操作按钮
  const renderPrimaryAction = () => {
    if (!primaryAction) return null

    const ActionComponent = getActionComponent(primaryAction)
    const actionProps = getActionProps(primaryAction)

    return (
      <ActionComponent
        {...actionProps}
        className={cn(
          buttonBaseClasses,
          getVariantClasses(primaryAction.variant)
        )}
      >
        {primaryAction.label}
        {primaryAction.external && (
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
        {!primaryAction.external && !primaryAction.href && (
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </ActionComponent>
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* 次要操作按钮 */}
      {secondaryActions.map((action, index) => {
        const ActionComponent = getActionComponent({ 
          href: action.href, 
          external: action.href?.startsWith('http') 
        })
        const actionProps = getActionProps({ 
          href: action.href, 
          external: action.href?.startsWith('http'),
          onClick: action.onClick
        })

        return (
          <ActionComponent
            key={index}
            {...actionProps}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={action.label}
          >
            {action.icon || (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            )}
          </ActionComponent>
        )
      })}
      
      {/* 主要操作按钮 */}
      {renderPrimaryAction()}
    </div>
  )
}