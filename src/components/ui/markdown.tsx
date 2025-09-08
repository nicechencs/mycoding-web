'use client'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  children: string
  className?: string
}

// 性能优化：将插件数组提取为常量，避免每次渲染重新创建
const REMARK_PLUGINS = [remarkGfm]
const REHYPE_PLUGINS = [rehypeHighlight, rehypeSanitize]

// 性能优化：将组件配置提取为常量，避免每次渲染重新创建
const MARKDOWN_COMPONENTS = {
          h1: ({ children }: { children: React.ReactNode }) => (
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }: { children: React.ReactNode }) => (
            <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }: { children: React.ReactNode }) => (
            <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }: { children: React.ReactNode }) => (
            <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }: { children: React.ReactNode }) => (
            <p className="text-gray-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }: { children: React.ReactNode }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }: { children: React.ReactNode }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }: { children: React.ReactNode }) => (
            <li className="text-gray-700">{children}</li>
          ),
          blockquote: ({ children }: { children: React.ReactNode }) => (
            <blockquote className="border-l-4 border-blue-200 pl-4 my-4 italic text-gray-600 bg-gray-50 py-2">
              {children}
            </blockquote>
          ),
          code: ({ inline, children, className, ...props }: {
            inline?: boolean;
            children: React.ReactNode;
            className?: string;
            [key: string]: unknown;
          }) => {
            const match = /language-(\w+)/.exec(className || '')
            
            if (!inline && match) {
              return (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              )
            }
            
            return (
              <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }: { children: React.ReactNode }) => (
            <div className="mb-4">
              {children}
            </div>
          ),
          strong: ({ children }: { children: React.ReactNode }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }: { children: React.ReactNode }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          a: ({ children, href, ...props }: { 
            children?: React.ReactNode; 
            href?: string; 
            [key: string]: unknown; 
          }) => {
            // 安全的href验证
            const isValidHref = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/') || href.startsWith('#'))
            
            return (
              <a 
                href={isValidHref ? href : '#'} 
                className="text-blue-600 hover:text-blue-700 underline" 
                target={href?.startsWith('http') ? "_blank" : undefined}
                rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            )
          },
          table: ({ children }: { children: React.ReactNode }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }: { children: React.ReactNode }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          tbody: ({ children }: { children: React.ReactNode }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }: { children: React.ReactNode }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }: { children: React.ReactNode }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }: { children: React.ReactNode }) => (
            <td className="px-4 py-3 text-sm text-gray-700">
              {children}
            </td>
          ),
}

export function Markdown({ children, className }: MarkdownProps) {
  // 处理模板字符串中的缩进问题
  const processedContent = useMemo(() => {
    if (!children) return ''
    // 移除每行的前导空格，保留Markdown格式
    return children.split('\n').map(line => line.trimStart()).join('\n').trim()
  }, [children])
  
  return (
    <div className={cn('prose prose-gray max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={MARKDOWN_COMPONENTS}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}