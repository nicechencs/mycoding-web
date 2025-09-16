import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  // 简单的 Markdown 链接解析
  const renderContent = () => {
    // 匹配 [text](url) 格式的链接
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      // 添加链接前的文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        )
      }

      // 添加链接
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline"
          onClick={e => e.stopPropagation()}
        >
          {match[1]}
        </a>
      )

      lastIndex = linkRegex.lastIndex
    }

    // 添加剩余的文本
    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>)
    }

    return parts.length > 0 ? parts : content
  }

  return (
    <div className={`whitespace-pre-wrap ${className}`}>{renderContent()}</div>
  )
}
