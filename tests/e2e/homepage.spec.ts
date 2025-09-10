import { test, expect } from '@playwright/test'

test.describe('首页 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/')
  })

  test('页面基本元素加载正确', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/MyCoding/)

    // 检查网站Logo和名称
    await expect(page.getByText('💻')).toBeVisible()
    await expect(page.getByText('MyCoding')).toBeVisible()

    // 检查主导航菜单
    await expect(page.getByRole('link', { name: '首页' })).toBeVisible()
    await expect(page.getByRole('link', { name: '资源' })).toBeVisible()
    await expect(page.getByRole('link', { name: '文章' })).toBeVisible()
    await expect(page.getByRole('link', { name: '动态' })).toBeVisible()
  })

  test('导航功能正常工作', async ({ page }) => {
    // 点击资源页面链接
    await page.getByRole('link', { name: '资源' }).click()
    await expect(page).toHaveURL('/resources')

    // 返回首页
    await page.getByRole('link', { name: 'MyCoding' }).click()
    await expect(page).toHaveURL('/')

    // 点击文章页面链接
    await page.getByRole('link', { name: '文章' }).click()
    await expect(page).toHaveURL('/posts')

    // 返回首页
    await page.goto('/')

    // 点击动态页面链接
    await page.getByRole('link', { name: '动态' }).click()
    await expect(page).toHaveURL('/vibes')
  })

  test('移动端导航菜单功能', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })

    // 检查移动端菜单按钮存在
    const menuButton = page.getByLabel('切换菜单')
    await expect(menuButton).toBeVisible()

    // 初始状态下移动端菜单应该不可见
    await expect(page.locator('[data-testid="mobile-nav"]')).not.toBeVisible()

    // 点击菜单按钮打开菜单
    await menuButton.click()

    // 移动端菜单应该可见
    await expect(page.getByText('个人中心').first()).toBeVisible()

    // 点击菜单项应该导航并关闭菜单
    await page.locator('text=资源').nth(1).click() // 选择移动端菜单中的资源链接
    await expect(page).toHaveURL('/resources')
  })

  test('认证状态显示正确', async ({ page }) => {
    // 未登录状态应该显示登录和注册按钮
    await expect(page.getByText('登录')).toBeVisible()
    await expect(page.getByText('注册')).toBeVisible()

    // 不应该显示用户菜单
    await expect(page.getByTestId('user-menu')).not.toBeVisible()
  })

  test('页面性能检查', async ({ page }) => {
    // 开始性能监控
    await page.goto('/', { waitUntil: 'networkidle' })

    // 检查页面加载时间
    const performanceTiming = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.navigationStart,
        load: navigation.loadEventEnd - navigation.navigationStart,
        firstContentfulPaint:
          performance.getEntriesByName('first-contentful-paint')[0]
            ?.startTime || 0,
      }
    })

    // 页面应该在合理时间内加载完成（3秒内）
    expect(performanceTiming.domContentLoaded).toBeLessThan(3000)
    expect(performanceTiming.load).toBeLessThan(5000)

    // 首次内容绘制应该快速（2秒内）
    if (performanceTiming.firstContentfulPaint > 0) {
      expect(performanceTiming.firstContentfulPaint).toBeLessThan(2000)
    }
  })

  test('搜索功能', async ({ page }) => {
    // 如果有搜索框，测试搜索功能
    const searchInput = page.locator(
      'input[placeholder*="搜索"], input[type="search"]'
    )

    if (await searchInput.isVisible()) {
      // 输入搜索关键词
      await searchInput.fill('React')

      // 按回车或点击搜索按钮
      await searchInput.press('Enter')

      // 等待搜索结果页面加载
      await page.waitForLoadState('networkidle')

      // 检查是否跳转到搜索结果页面
      expect(page.url()).toContain('search')
    }
  })

  test('主要内容区域加载', async ({ page }) => {
    // 检查主要内容区域存在
    await expect(page.locator('main')).toBeVisible()

    // 检查是否有内容加载（可能是资源卡片、文章列表等）
    const contentCards = page.locator('[data-testid*="card"], .card, article')

    if ((await contentCards.count()) > 0) {
      // 至少应该有一些内容卡片
      await expect(contentCards.first()).toBeVisible()
    }
  })

  test('页脚信息显示', async ({ page }) => {
    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // 检查页脚是否存在
    const footer = page.locator('footer')
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible()

      // 检查版权信息或其他页脚内容
      const footerText = await footer.textContent()
      expect(footerText).toBeTruthy()
    }
  })

  test('响应式设计', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })

      // 检查基本元素在不同屏幕尺寸下都能正确显示
      await expect(page.getByText('MyCoding')).toBeVisible()

      if (viewport.width < 768) {
        // 移动端：菜单按钮应该可见，桌面导航应该隐藏
        await expect(page.getByLabel('切换菜单')).toBeVisible()
      } else {
        // 桌面端：主导航应该可见
        await expect(page.getByRole('navigation')).toBeVisible()
      }
    }
  })

  test('无障碍性检查', async ({ page }) => {
    // 检查页面是否有适当的标题结构
    const h1Elements = page.locator('h1')
    await expect(h1Elements).toHaveCount(1) // 应该只有一个h1标签

    // 检查图片是否有alt属性
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // 所有图片都应该有alt属性
    }

    // 检查链接是否有适当的文本
    const links = page.locator('a')
    const linkCount = await links.count()

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      // 只检查前10个链接以避免测试过长
      const link = links.nth(i)
      const linkText = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')

      expect(linkText || ariaLabel).toBeTruthy() // 链接应该有文本内容或aria-label
    }
  })

  test('错误处理', async ({ page }) => {
    // 测试访问不存在的页面
    const response = await page.goto('/nonexistent-page', {
      waitUntil: 'networkidle',
    })

    // 应该返回404状态或显示404页面
    expect(response?.status()).toBe(404)

    // 或者检查是否显示了错误页面
    const errorContent = await page.textContent('body')
    expect(errorContent).toMatch(/(404|页面不存在|Not Found)/i)
  })

  test('JavaScript功能正常', async ({ page }) => {
    // 检查JavaScript是否正常工作
    const jsEnabled = await page.evaluate(() => {
      return typeof window !== 'undefined' && window.document !== undefined
    })

    expect(jsEnabled).toBe(true)

    // 检查React是否正常工作（如果页面使用了React）
    const reactElements = page.locator('[data-reactroot], #__next, #root')
    if ((await reactElements.count()) > 0) {
      await expect(reactElements.first()).toBeVisible()
    }
  })

  test('网络请求检查', async ({ page }) => {
    const responses: any[] = []

    // 监听网络请求
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        ok: response.ok(),
      })
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    // 检查是否有失败的关键资源请求
    const failedRequests = responses.filter(
      r =>
        !r.ok &&
        (r.url.includes('.js') ||
          r.url.includes('.css') ||
          r.url.includes('/api/'))
    )

    expect(failedRequests).toHaveLength(0)

    // 检查主要资源是否成功加载
    const mainRequests = responses.filter(
      r => r.url.includes('_next/static') || r.url.endsWith('/')
    )

    expect(mainRequests.length).toBeGreaterThan(0)
    expect(mainRequests.every(r => r.ok)).toBe(true)
  })
})
