import { test, expect } from '@playwright/test'

test.describe('认证系统 E2E 测试', () => {
  test.describe('用户登录流程', () => {
    test('成功登录流程', async ({ page }) => {
      // 访问首页
      await page.goto('/')

      // 点击登录按钮
      await page.getByText('登录').first().click()

      // 应该跳转到登录页面
      await expect(page).toHaveURL('/login')
      await expect(page.getByText('用户登录')).toBeVisible()

      // 填写登录表单
      await page.fill(
        'input[name="email"], input[type="email"]',
        'test@example.com'
      )
      await page.fill(
        'input[name="password"], input[type="password"]',
        'password123'
      )

      // 点击登录按钮
      await page.getByRole('button', { name: '登录' }).click()

      // 等待登录完成（可能需要mock API响应）
      await page.waitForURL('/', { timeout: 10000 })

      // 检查登录后的状态
      await expect(page.getByText('登录')).not.toBeVisible()
      await expect(page.getByTestId('user-menu')).toBeVisible()
    })

    test('登录表单验证', async ({ page }) => {
      await page.goto('/login')

      // 尝试提交空表单
      await page.getByRole('button', { name: '登录' }).click()

      // 应该显示验证错误
      await expect(page.getByText('请输入邮箱')).toBeVisible()
      await expect(page.getByText('请输入密码')).toBeVisible()

      // 输入无效邮箱
      await page.fill('input[name="email"]', 'invalid-email')
      await page.getByRole('button', { name: '登录' }).click()

      await expect(page.getByText('请输入有效的邮箱地址')).toBeVisible()

      // 输入有效邮箱但密码太短
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', '123')
      await page.getByRole('button', { name: '登录' }).click()

      await expect(page.getByText('密码至少需要6个字符')).toBeVisible()
    })

    test('错误凭证处理', async ({ page }) => {
      await page.goto('/login')

      // 填写错误的登录信息
      await page.fill('input[name="email"]', 'wrong@example.com')
      await page.fill('input[name="password"]', 'wrongpassword')

      // 点击登录
      await page.getByRole('button', { name: '登录' }).click()

      // 应该显示错误信息
      await expect(page.getByText('用户名或密码错误')).toBeVisible()

      // 应该还在登录页面
      await expect(page).toHaveURL('/login')
    })

    test('记住我功能', async ({ page }) => {
      await page.goto('/login')

      // 勾选记住我选项
      const rememberCheckbox = page
        .locator('input[name="remember"], input[type="checkbox"]')
        .first()
      if (await rememberCheckbox.isVisible()) {
        await rememberCheckbox.check()
        await expect(rememberCheckbox).toBeChecked()
      }

      // 填写登录信息并提交
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      // 等待登录完成
      await page.waitForURL('/')
    })

    test('忘记密码链接', async ({ page }) => {
      await page.goto('/login')

      // 点击忘记密码链接
      const forgotPasswordLink = page.getByText('忘记密码')
      if (await forgotPasswordLink.isVisible()) {
        await forgotPasswordLink.click()

        // 应该跳转到密码重置页面
        await expect(page).toHaveURL(/forgot-password|reset-password/)
      }
    })
  })

  test.describe('用户注册流程', () => {
    test('成功注册流程', async ({ page }) => {
      await page.goto('/')

      // 点击注册按钮
      await page.getByText('注册').first().click()

      // 应该跳转到注册页面
      await expect(page).toHaveURL('/register')
      await expect(page.getByText('用户注册')).toBeVisible()

      // 填写注册表单
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'newuser@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')

      // 同意条款
      const termsCheckbox = page
        .locator('input[name="terms"], input[type="checkbox"]')
        .first()
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check()
      }

      // 点击注册按钮
      await page.getByRole('button', { name: '注册' }).click()

      // 等待注册完成
      await page.waitForURL('/')

      // 检查注册后的状态
      await expect(page.getByText('Test User')).toBeVisible()
    })

    test('注册表单验证', async ({ page }) => {
      await page.goto('/register')

      // 提交空表单
      await page.getByRole('button', { name: '注册' }).click()

      // 应该显示所有必填字段的错误
      await expect(page.getByText('请输入姓名')).toBeVisible()
      await expect(page.getByText('请输入邮箱')).toBeVisible()
      await expect(page.getByText('请输入密码')).toBeVisible()

      // 测试密码确认不匹配
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'different123')
      await page.getByRole('button', { name: '注册' }).click()

      await expect(page.getByText('两次输入的密码不一致')).toBeVisible()
    })

    test('邮箱已存在处理', async ({ page }) => {
      await page.goto('/register')

      // 填写已存在的邮箱
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'existing@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')

      await page.getByRole('button', { name: '注册' }).click()

      // 应该显示邮箱已存在的错误
      await expect(page.getByText('该邮箱已被注册')).toBeVisible()

      // 应该还在注册页面
      await expect(page).toHaveURL('/register')
    })

    test('用户协议和隐私政策', async ({ page }) => {
      await page.goto('/register')

      // 检查是否有用户协议链接
      const termsLink = page.getByText('用户协议')
      if (await termsLink.isVisible()) {
        await termsLink.click()

        // 应该打开用户协议页面或弹窗
        await expect(page.getByText('用户协议')).toBeVisible()
      }

      // 检查隐私政策链接
      const privacyLink = page.getByText('隐私政策')
      if (await privacyLink.isVisible()) {
        await privacyLink.click()

        // 应该打开隐私政策页面或弹窗
        await expect(page.getByText('隐私政策')).toBeVisible()
      }
    })
  })

  test.describe('用户菜单和注销', () => {
    test.beforeEach(async ({ page }) => {
      // 模拟已登录状态
      await page.goto('/login')

      // 填写登录信息
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      // 等待登录完成
      await page.waitForURL('/')
    })

    test('用户菜单展开和收起', async ({ page }) => {
      // 检查用户头像或菜单按钮
      const userMenuButton = page.getByTestId('user-menu-button')
      await expect(userMenuButton).toBeVisible()

      // 初始状态下拉菜单不可见
      await expect(page.getByText('个人中心')).not.toBeVisible()
      await expect(page.getByText('退出登录')).not.toBeVisible()

      // 点击用户菜单按钮
      await userMenuButton.click()

      // 下拉菜单应该可见
      await expect(page.getByText('个人中心')).toBeVisible()
      await expect(page.getByText('设置')).toBeVisible()
      await expect(page.getByText('退出登录')).toBeVisible()

      // 再次点击应该关闭菜单
      await userMenuButton.click()
      await expect(page.getByText('个人中心')).not.toBeVisible()
    })

    test('个人中心页面访问', async ({ page }) => {
      // 打开用户菜单
      await page.getByTestId('user-menu-button').click()

      // 点击个人中心
      await page.getByText('个人中心').click()

      // 应该跳转到个人中心页面
      await expect(page).toHaveURL('/dashboard')

      // 检查个人中心页面内容
      await expect(page.getByText('个人信息')).toBeVisible()
    })

    test('设置页面访问', async ({ page }) => {
      // 打开用户菜单
      await page.getByTestId('user-menu-button').click()

      // 点击设置
      await page.getByText('设置').click()

      // 应该跳转到设置页面
      await expect(page).toHaveURL('/settings')

      // 检查设置页面内容
      await expect(page.getByText('账户设置')).toBeVisible()
    })

    test('用户注销流程', async ({ page }) => {
      // 打开用户菜单
      await page.getByTestId('user-menu-button').click()

      // 点击退出登录
      await page.getByText('退出登录').click()

      // 等待注销完成
      await page.waitForURL('/')

      // 检查注销后的状态
      await expect(page.getByText('登录')).toBeVisible()
      await expect(page.getByText('注册')).toBeVisible()
      await expect(page.getByTestId('user-menu')).not.toBeVisible()
    })
  })

  test.describe('移动端认证流程', () => {
    test.beforeEach(async ({ page }) => {
      // 设置移动端视口
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('移动端登录流程', async ({ page }) => {
      await page.goto('/')

      // 打开移动端菜单
      await page.getByLabel('切换菜单').click()

      // 点击登录
      await page.locator('text=登录').nth(1).click() // 移动端菜单中的登录

      await expect(page).toHaveURL('/login')

      // 在移动端完成登录
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      await page.waitForURL('/')

      // 检查移动端登录后状态
      await page.getByLabel('切换菜单').click()
      await expect(page.getByText('个人中心')).toBeVisible()
      await expect(page.getByText('退出登录')).toBeVisible()
    })

    test('移动端注册流程', async ({ page }) => {
      await page.goto('/')

      // 打开移动端菜单
      await page.getByLabel('切换菜单').click()

      // 点击注册
      await page.locator('text=注册').nth(1).click()

      await expect(page).toHaveURL('/register')

      // 在移动端完成注册
      await page.fill('input[name="name"]', 'Mobile User')
      await page.fill('input[name="email"]', 'mobile@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')

      await page.getByRole('button', { name: '注册' }).click()

      await page.waitForURL('/')

      // 检查注册后状态
      await page.getByLabel('切换菜单').click()
      await expect(page.getByText('Mobile User')).toBeVisible()
    })
  })

  test.describe('认证状态持久化', () => {
    test('刷新页面后保持登录状态', async ({ page, context }) => {
      // 登录
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      await page.waitForURL('/')

      // 刷新页面
      await page.reload()

      // 应该保持登录状态
      await expect(page.getByTestId('user-menu')).toBeVisible()
      await expect(page.getByText('登录')).not.toBeVisible()
    })

    test('新标签页中保持登录状态', async ({ page, context }) => {
      // 在第一个标签页登录
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      await page.waitForURL('/')

      // 打开新标签页
      const newPage = await context.newPage()
      await newPage.goto('/')

      // 新标签页中应该也是登录状态
      await expect(newPage.getByTestId('user-menu')).toBeVisible()
      await expect(newPage.getByText('登录')).not.toBeVisible()

      await newPage.close()
    })

    test('清除浏览器数据后需要重新登录', async ({ page, context }) => {
      // 登录
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      await page.waitForURL('/')

      // 清除本地存储
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })

      // 刷新页面
      await page.reload()

      // 应该退出登录状态
      await expect(page.getByText('登录')).toBeVisible()
      await expect(page.getByText('注册')).toBeVisible()
      await expect(page.getByTestId('user-menu')).not.toBeVisible()
    })
  })

  test.describe('认证安全性', () => {
    test('防止XSS攻击', async ({ page }) => {
      await page.goto('/login')

      // 尝试在用户名字段中注入脚本
      await page.fill(
        'input[name="email"]',
        '<script>alert("XSS")</script>@example.com'
      )
      await page.fill('input[name="password"]', 'password123')
      await page.getByRole('button', { name: '登录' }).click()

      // 页面不应该执行恶意脚本
      const alerts = []
      page.on('dialog', dialog => {
        alerts.push(dialog.message())
        dialog.accept()
      })

      await page.waitForTimeout(1000)
      expect(alerts).toHaveLength(0)
    })

    test('密码字段正确屏蔽', async ({ page }) => {
      await page.goto('/login')

      const passwordInput = page.locator('input[name="password"]')

      // 检查密码字段类型
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // 输入密码
      await passwordInput.fill('secretpassword')

      // 检查值是否被正确屏蔽
      const inputValue = await passwordInput.inputValue()
      expect(inputValue).toBe('secretpassword')

      // 但页面上不应该显示明文密码
      const visibleText = await page.textContent('body')
      expect(visibleText).not.toContain('secretpassword')
    })

    test('防止CSRF攻击', async ({ page }) => {
      await page.goto('/login')

      // 检查登录表单是否包含CSRF token
      const csrfToken = await page
        .locator('input[name="_token"], meta[name="csrf-token"]')
        .first()

      if ((await csrfToken.count()) > 0) {
        const tokenValue =
          (await csrfToken.getAttribute('value')) ||
          (await csrfToken.getAttribute('content'))
        expect(tokenValue).toBeTruthy()
        expect(tokenValue.length).toBeGreaterThan(0)
      }
    })
  })
})
