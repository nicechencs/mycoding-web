/**
 * 时间格式化工具函数
 */

/**
 * 格式化为相对时间（如：3分钟前、2小时前、昨天）
 * @param date 日期对象或时间戳
 * @returns 格式化后的相对时间字符串
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  )

  if (diffInSeconds < 60) {
    return '刚刚'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) {
    return '昨天'
  }
  if (diffInDays === 2) {
    return '前天'
  }
  if (diffInDays < 7) {
    return `${diffInDays}天前`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}周前`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}年前`
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number): string {
  const targetDate = new Date(date)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string | number): string {
  const targetDate = new Date(date)
  const dateStr = formatDate(targetDate)
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')
  return `${dateStr} ${hours}:${minutes}`
}

/**
 * 格式化为本地化日期字符串
 * @param date 日期对象或时间戳
 * @param locale 语言环境，默认为 'zh-CN'
 * @returns 本地化的日期字符串
 */
export function formatLocalDate(
  date: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const targetDate = new Date(date)
  return targetDate.toLocaleDateString(locale)
}

/**
 * 格式化为本地化时间字符串
 * @param date 日期对象或时间戳
 * @param options 时间格式选项
 * @param locale 语言环境，默认为 'zh-CN'
 * @returns 本地化的时间字符串
 */
export function formatLocalTime(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
  locale: string = 'zh-CN'
): string {
  const targetDate = new Date(date)
  return targetDate.toLocaleTimeString(locale, options)
}

/**
 * 获取友好的时间显示
 * 今天的显示时间，昨天的显示"昨天"，更早的显示日期
 * @param date 日期对象或时间戳
 * @returns 友好的时间显示字符串
 */
export function getFriendlyTime(date: Date | string | number): string {
  const targetDate = new Date(date)
  const now = new Date()

  // 判断是否是今天
  if (isSameDay(targetDate, now)) {
    return formatLocalTime(targetDate)
  }

  // 判断是否是昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(targetDate, yesterday)) {
    return `昨天 ${formatLocalTime(targetDate)}`
  }

  // 判断是否是今年
  if (targetDate.getFullYear() === now.getFullYear()) {
    const month = targetDate.getMonth() + 1
    const day = targetDate.getDate()
    return `${month}月${day}日`
  }

  // 其他情况显示完整日期
  return formatLocalDate(targetDate)
}

/**
 * 判断两个日期是否是同一天
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 是否是同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * 获取日期的开始时间（00:00:00）
 * @param date 日期对象
 * @returns 当天的开始时间
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

/**
 * 获取日期的结束时间（23:59:59）
 * @param date 日期对象
 * @returns 当天的结束时间
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}
