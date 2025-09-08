import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      {
        'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500':
          variant === 'primary',
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500':
          variant === 'secondary',
        'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus-visible:ring-blue-500':
          variant === 'outline',
        'text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500':
          variant === 'ghost',
        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500':
          variant === 'destructive',
      },
      {
        'h-10 py-2 px-4': size === 'default',
        'h-9 px-3 rounded-md': size === 'sm',
        'h-11 px-8 rounded-md': size === 'lg',
        'h-10 w-10': size === 'icon',
      },
      className
    )

    if (asChild) {
      return React.cloneElement(
        React.Children.only(props.children as React.ReactElement),
        {
          className: cn(baseClasses, (props.children as any)?.props?.className),
          ...props,
          children: undefined,
        }
      )
    }

    return <button className={baseClasses} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }
