/**
 * 开发环境日志工具
 * 在生产环境自动禁用console.log
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, ...args: unknown[]): void {
    if (!this.isDevelopment) return

    switch (level) {
      case 'debug':
        console.debug('[DEBUG]', ...args)
        break
      case 'info':
        console.info('[INFO]', ...args)
        break
      case 'warn':
        console.warn('[WARN]', ...args)
        break
      case 'error':
        console.error('[ERROR]', ...args)
        break
    }
  }

  debug(...args: unknown[]): void {
    this.log('debug', ...args)
  }

  info(...args: unknown[]): void {
    this.log('info', ...args)
  }

  warn(...args: unknown[]): void {
    this.log('warn', ...args)
  }

  error(...args: unknown[]): void {
    this.log('error', ...args)
  }
}

export const logger = new Logger()
