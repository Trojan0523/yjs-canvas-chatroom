import { test, expect } from '@playwright/test';

/**
 * OAuth登录页面测试
 */
test.describe('OAuth登录页面测试', () => {
  test('登录页面应显示所有OAuth按钮', async ({ page }) => {
    // 导航到登录页面
    await page.goto('/login');

    // 验证页面标题
    await expect(page).toHaveTitle(/登录|登陆|欢迎回来/);

    // 验证所有OAuth按钮都存在
    await expect(page.getByText('继续使用 Google 登录')).toBeVisible();
    await expect(page.getByText('继续使用 GitHub 登录')).toBeVisible();

    // 验证传统登录表单也存在
    await expect(page.getByLabel(/电子邮件地址/)).toBeVisible();
    await expect(page.getByLabel(/密码/)).toBeVisible();
    await expect(page.getByRole('button', { name: /继续|登录/ })).toBeVisible();
  });

  test('未登录时应显示登录和注册按钮', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 检查导航栏有登录按钮
    await expect(page.getByRole('link', { name: '登录' })).toBeVisible();

    // 检查注册按钮
    await expect(page.getByRole('link', { name: '注册' })).toBeVisible();
  });
});

/**
 * GitHub OAuth登录流程测试
 */
test.describe('GitHub登录流程测试', () => {
  // 使用预先设置的GitHub认证状态
  test.use({ storageState: 'playwright/.auth/github-user.json' });

  test('已登录的GitHub用户应显示在导航栏', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 验证GitHub标签显示
    await expect(page.getByText('GitHub', { exact: true })).toBeVisible();

    // 验证用户名显示
    await expect(page.getByText('GitHub 测试用户')).toBeVisible();

    // 验证有登出按钮
    const profileButton = page.locator('button', { has: page.getByText('GitHub 测试用户') });
    await profileButton.click();

    await expect(page.getByText('退出登录')).toBeVisible();
  });

  test('GitHub用户应能访问个人资料页面', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 点击用户头像打开下拉菜单
    const profileButton = page.locator('button', { has: page.getByText('GitHub 测试用户') });
    await profileButton.click();

    // 点击个人资料链接
    await page.getByText('个人资料').click();

    // 验证成功导航到个人资料页面
    await expect(page).toHaveURL(/\/profile/);

    // 验证个人资料页面显示GitHub用户信息
    await expect(page.getByText('GitHub 测试用户')).toBeVisible();
    await expect(page.getByText('github_test@example.com')).toBeVisible();
  });

  test('GitHub用户应能成功登出', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 点击用户头像打开下拉菜单
    const profileButton = page.locator('button', { has: page.getByText('GitHub 测试用户') });
    await profileButton.click();

    // 点击登出按钮
    await page.getByText('退出登录').click();

    // 验证重定向到登录页面
    await expect(page).toHaveURL(/\/login/);

    // 验证导航栏显示登录和注册按钮
    await expect(page.getByRole('link', { name: '登录' })).toBeVisible();
  });
});

/**
 * Google OAuth登录流程测试
 */
test.describe('Google登录流程测试', () => {
  // 使用预先设置的Google认证状态
  test.use({ storageState: 'playwright/.auth/google-user.json' });

  test('已登录的Google用户应显示在导航栏', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 验证Google标签显示
    await expect(page.getByText('Google', { exact: true })).toBeVisible();

    // 验证用户名显示
    await expect(page.getByText('Google 测试用户')).toBeVisible();
  });

  test('Google用户应能访问个人资料页面', async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 点击用户头像打开下拉菜单
    const profileButton = page.locator('button', { has: page.getByText('Google 测试用户') });
    await profileButton.click();

    // 点击个人资料链接
    await page.getByText('个人资料').click();

    // 验证成功导航到个人资料页面
    await expect(page).toHaveURL(/\/profile/);

    // 验证个人资料页面显示Google用户信息
    await expect(page.getByText('Google 测试用户')).toBeVisible();
    await expect(page.getByText('google_test@example.com')).toBeVisible();
  });
});

/**
 * 错误处理测试
 */
test.describe('OAuth错误处理测试', () => {
  test('处理OAuth回调错误', async ({ page }) => {
    // 访问带有错误参数的OAuth回调页面
    await page.goto('/oauth-callback?error=true&provider=github');

    // 验证显示错误信息
    await expect(page.getByText(/认证错误|登录失败/)).toBeVisible();

    // 验证有返回登录页面的按钮
    await expect(page.getByRole('button', { name: /返回登录/ })).toBeVisible();
  });
});
