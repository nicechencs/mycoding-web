import { Article } from './index'

// 文章表单数据类型
export interface ArticleFormData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  coverImage?: string
}

// 文章创建请求类型
export interface CreateArticleRequest extends ArticleFormData {
  isDraft: boolean
}

// 文章更新请求类型
export interface UpdateArticleRequest extends Partial<ArticleFormData> {
  isDraft?: boolean
}

// 文章草稿类型
export interface ArticleDraft extends Article {
  isDraft: boolean
}
