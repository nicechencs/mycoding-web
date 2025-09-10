#!/usr/bin/env node

/**
 * 综合功能测试脚本
 * 测试 Next.js 应用的关键功能和路由
 */

const http = require('http')
const { promisify } = require('util')

class AppTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
    this.testResults = {
      routes: {},
      services: {},
      hooks: {},
      performance: {},
    }
  }

  async makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        timeout: 10000,
      }

      const req = http.request(options, res => {
        let data = ''

        res.on('data', chunk => {
          data += chunk
        })

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            success: res.statusCode >= 200 && res.statusCode < 400,
          })
        })
      })

      req.on('error', err => {
        reject(err)
      })

      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })

      req.end()
    })
  }

  async testRoute(routeName, path) {
    try {
      console.log(`🧪 测试路由: ${routeName} (${path})`)

      const response = await this.makeRequest(path)
      const result = {
        path,
        statusCode: response.statusCode,
        success: response.success,
        hasContent: response.body.length > 0,
        contentType: response.headers['content-type'] || 'unknown',
        timestamp: new Date().toISOString(),
      }

      if (response.success) {
        // 检查是否包含预期的内容
        const hasNextScript = response.body.includes('_next/static')
        const hasReactRoot = response.body.includes('__next')

        result.hasNextScript = hasNextScript
        result.hasReactRoot = hasReactRoot
        result.isValidNextPage = hasNextScript || hasReactRoot

        console.log(
          `✅ ${routeName}: ${response.statusCode} - 内容长度: ${response.body.length}字符`
        )
      } else {
        console.log(`❌ ${routeName}: ${response.statusCode}`)
      }

      this.testResults.routes[routeName] = result
      return result
    } catch (error) {
      console.log(`💥 ${routeName}: 请求失败 - ${error.message}`)
      this.testResults.routes[routeName] = {
        path,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString(),
      }
      return null
    }
  }

  async testAllRoutes() {
    console.log('\n🌐 开始测试关键路由...\n')

    const routes = [
      ['首页', '/'],
      ['资源页', '/resources'],
      ['文章页', '/posts'],
      ['动态页', '/vibes'],
      ['导航测试页', '/nav-test'],
      ['简单测试页', '/simple-test'],
      ['登录页', '/login'],
      ['注册页', '/register'],
      ['API健康检查', '/api/health'],
    ]

    for (const [name, path] of routes) {
      await this.testRoute(name, path)
      // 短暂延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  checkServiceFiles() {
    console.log('\n📦 检查服务文件...\n')

    const fs = require('fs')
    const path = require('path')

    const services = [
      'articles.service.ts',
      'resources.service.ts',
      'vibes.service.ts',
    ]

    services.forEach(service => {
      const servicePath = path.join(__dirname, 'src', 'services', service)
      try {
        const exists = fs.existsSync(servicePath)
        const stats = exists ? fs.statSync(servicePath) : null

        this.testResults.services[service] = {
          exists,
          size: stats ? stats.size : 0,
          modified: stats ? stats.mtime : null,
        }

        if (exists) {
          console.log(`✅ ${service}: 存在 (${stats.size} 字节)`)
        } else {
          console.log(`❌ ${service}: 不存在`)
        }
      } catch (error) {
        console.log(`💥 ${service}: 检查失败 - ${error.message}`)
        this.testResults.services[service] = {
          exists: false,
          error: error.message,
        }
      }
    })
  }

  checkHookFiles() {
    console.log('\n🔗 检查 Hook 文件...\n')

    const fs = require('fs')
    const path = require('path')

    const hooks = [
      'use-articles.ts',
      'use-resources.ts',
      'use-vibes.ts',
      'use-user.ts',
    ]

    hooks.forEach(hook => {
      const hookPath = path.join(__dirname, 'src', 'hooks', hook)
      try {
        const exists = fs.existsSync(hookPath)
        const stats = exists ? fs.statSync(hookPath) : null

        this.testResults.hooks[hook] = {
          exists,
          size: stats ? stats.size : 0,
          modified: stats ? stats.mtime : null,
        }

        if (exists) {
          console.log(`✅ ${hook}: 存在 (${stats.size} 字节)`)
        } else {
          console.log(`❌ ${hook}: 不存在`)
        }
      } catch (error) {
        console.log(`💥 ${hook}: 检查失败 - ${error.message}`)
        this.testResults.hooks[hook] = {
          exists: false,
          error: error.message,
        }
      }
    })
  }

  checkPerformanceComponents() {
    console.log('\n⚡ 检查性能优化组件...\n')

    const fs = require('fs')
    const path = require('path')

    const components = [
      ['PerformanceWrapper', 'src/components/app/PerformanceWrapper.tsx'],
      ['LazyImage', 'src/components/ui/lazy-image.tsx'],
      ['Dynamic Imports', 'src/lib/utils/dynamic-imports.ts'],
    ]

    components.forEach(([name, relativePath]) => {
      const componentPath = path.join(__dirname, relativePath)
      try {
        const exists = fs.existsSync(componentPath)
        const stats = exists ? fs.statSync(componentPath) : null

        this.testResults.performance[name] = {
          path: relativePath,
          exists,
          size: stats ? stats.size : 0,
          modified: stats ? stats.mtime : null,
        }

        if (exists) {
          console.log(`✅ ${name}: 存在 (${stats.size} 字节)`)
        } else {
          console.log(`❌ ${name}: 不存在`)
        }
      } catch (error) {
        console.log(`💥 ${name}: 检查失败 - ${error.message}`)
        this.testResults.performance[name] = {
          path: relativePath,
          exists: false,
          error: error.message,
        }
      }
    })
  }

  generateReport() {
    console.log('\n📋 生成测试报告...\n')

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRoutes: Object.keys(this.testResults.routes).length,
        successfulRoutes: Object.values(this.testResults.routes).filter(
          r => r.success
        ).length,
        totalServices: Object.keys(this.testResults.services).length,
        existingServices: Object.values(this.testResults.services).filter(
          s => s.exists
        ).length,
        totalHooks: Object.keys(this.testResults.hooks).length,
        existingHooks: Object.values(this.testResults.hooks).filter(
          h => h.exists
        ).length,
        totalPerformanceComponents: Object.keys(this.testResults.performance)
          .length,
        existingPerformanceComponents: Object.values(
          this.testResults.performance
        ).filter(p => p.exists).length,
      },
      details: this.testResults,
    }

    // 计算总体成功率
    const routeSuccessRate = (
      (report.summary.successfulRoutes / report.summary.totalRoutes) *
      100
    ).toFixed(1)
    const serviceSuccessRate = (
      (report.summary.existingServices / report.summary.totalServices) *
      100
    ).toFixed(1)
    const hookSuccessRate = (
      (report.summary.existingHooks / report.summary.totalHooks) *
      100
    ).toFixed(1)
    const performanceSuccessRate = (
      (report.summary.existingPerformanceComponents /
        report.summary.totalPerformanceComponents) *
      100
    ).toFixed(1)

    console.log('🎯 测试摘要:')
    console.log(
      `   路由测试: ${report.summary.successfulRoutes}/${report.summary.totalRoutes} (${routeSuccessRate}%)`
    )
    console.log(
      `   服务文件: ${report.summary.existingServices}/${report.summary.totalServices} (${serviceSuccessRate}%)`
    )
    console.log(
      `   Hook文件: ${report.summary.existingHooks}/${report.summary.totalHooks} (${hookSuccessRate}%)`
    )
    console.log(
      `   性能组件: ${report.summary.existingPerformanceComponents}/${report.summary.totalPerformanceComponents} (${performanceSuccessRate}%)`
    )

    // 保存详细报告
    const fs = require('fs')
    const reportPath = './test-report.json'

    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
      console.log(`\n📄 详细报告已保存到: ${reportPath}`)
    } catch (error) {
      console.log(`⚠️ 无法保存报告: ${error.message}`)
    }

    return report
  }

  async runAllTests() {
    console.log('🚀 开始综合功能测试...')
    console.log(`🌐 目标服务器: ${this.baseUrl}`)
    console.log(`⏰ 测试时间: ${new Date().toLocaleString()}\n`)

    try {
      // 测试路由
      await this.testAllRoutes()

      // 检查服务文件
      this.checkServiceFiles()

      // 检查Hook文件
      this.checkHookFiles()

      // 检查性能组件
      this.checkPerformanceComponents()

      // 生成报告
      const report = this.generateReport()

      console.log('\n🎉 测试完成!')

      return report
    } catch (error) {
      console.error('💥 测试过程中发生错误:', error)
      throw error
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const tester = new AppTester()

  tester
    .runAllTests()
    .then(() => {
      console.log('\n✅ 所有测试已完成')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 测试失败:', error)
      process.exit(1)
    })
}

module.exports = AppTester
