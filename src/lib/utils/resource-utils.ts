import type { Resource } from '@/types/resource'

/**
 * 资源相关的工具函数集合
 *
 * 这些函数提供了资源数据处理的常用功能，
 * 重构自过度抽象的 useResourceDetailUtils Hook
 */
export const ResourceUtils = {
  /**
   * 检查资源是否为精选资源
   * @param resource 资源对象
   * @returns 是否为精选资源
   */
  isFeatured: (resource: Resource | null): boolean => {
    return resource?.featured ?? false
  },

  /**
   * 获取资源的主要标签（前N个）
   * @param resource 资源对象
   * @param limit 标签数量限制，默认3个
   * @returns 主要标签数组
   */
  getPrimaryTags: (resource: Resource | null, limit: number = 3): string[] => {
    return resource?.tags.slice(0, limit) ?? []
  },

  /**
   * 计算资源的受欢迎程度评分
   * 基于浏览量、点赞和评论数的加权计算
   *
   * @param resource 资源对象
   * @returns 受欢迎程度评分（0-100）
   */
  calculatePopularityScore: (resource: Resource): number => {
    if (!resource) return 0

    // 权重分配: 浏览量(40%) + 点赞数(40%) + 评论数(20%)
    const viewScore = Math.min(resource.viewCount / 1000, 100) * 0.4
    const likeScore = Math.min(resource.likeCount / 100, 100) * 0.4
    const commentScore = Math.min(resource.commentCount / 50, 100) * 0.2

    return Math.round(viewScore + likeScore + commentScore)
  },

  /**
   * 格式化资源统计数字为易读格式
   * @param count 数字
   * @returns 格式化后的字符串
   *
   * @example
   * formatCount(1234) // "1.2K"
   * formatCount(1234567) // "1.2M"
   * formatCount(999) // "999"
   */
  formatCount: (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  },

  /**
   * 计算资源质量评分
   * 综合考虑评分、评论质量和受欢迎程度
   *
   * @param resource 资源对象
   * @returns 质量评分（0-100）
   */
  calculateQualityScore: (resource: Resource): number => {
    if (!resource) return 0

    // 基础评分 (0-5星转换为0-50分)
    const ratingScore = (resource.rating / 5) * 50

    // 评论活跃度加分 (最多25分)
    const commentActivityScore = Math.min(resource.commentCount / 10, 25)

    // 受欢迎程度加分 (最多25分，基于现有函数)
    const popularityBonus =
      ResourceUtils.calculatePopularityScore(resource) * 0.25

    return Math.round(ratingScore + commentActivityScore + popularityBonus)
  },

  /**
   * 检查资源是否为热门资源
   * 基于浏览量和评分的综合判断
   *
   * @param resource 资源对象
   * @returns 是否为热门资源
   */
  isTrending: (resource: Resource | null): boolean => {
    if (!resource) return false

    // 热门阈值：浏览量>5000 且 评分>4.0
    return resource.viewCount > 5000 && resource.rating > 4.0
  },

  /**
   * 获取资源的显示状态标签
   * @param resource 资源对象
   * @returns 状态标签数组
   */
  getStatusLabels: (resource: Resource | null): string[] => {
    if (!resource) return []

    const labels: string[] = []

    if (ResourceUtils.isFeatured(resource)) {
      labels.push('精选')
    }

    if (ResourceUtils.isTrending(resource)) {
      labels.push('热门')
    }

    if (resource.rating >= 4.5) {
      labels.push('高质量')
    }

    if (resource.commentCount > 50) {
      labels.push('活跃讨论')
    }

    return labels
  },
}

// 导出个别函数供直接使用
export const {
  isFeatured,
  getPrimaryTags,
  calculatePopularityScore,
  formatCount,
  calculateQualityScore,
  isTrending,
  getStatusLabels,
} = ResourceUtils
