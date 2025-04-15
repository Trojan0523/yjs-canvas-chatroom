import { test as setup, expect } from '@playwright/test';

/**
 * 模拟GitHub OAuth流程的登录状态
 */
setup('模拟GitHub OAuth登录', async ({ page }) => {
  // 1. 访问登录页面
  await page.goto('/login');
  await expect(page).toHaveTitle(/登录/);

  // 2. 点击"使用GitHub登录"按钮
  const githubButton = page.getByText('继续使用 GitHub 登录');
  await expect(githubButton).toBeVisible();

  // 3. 我们不能直接点击GitHub按钮，因为它会重定向到实际的GitHub
  // 相反我们直接模拟OAuth回调过程

  // 创建模拟的OAuth回调数据
  const mockUser = {
    id: 'gh_123456',
    username: 'github_test_user',
    email: 'github_test@example.com',
    providerId: 'gh_123456',
    provider: 'github',
    photo: 'https://avatars.githubusercontent.com/u/mock',
    displayName: 'GitHub 测试用户'
  };

  // 模拟OAuth回调 - 直接设置localStorage
  await page.evaluate((userData) => {
    const token = 'mock_github_token_xyz';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }, mockUser);

  // 重定向到主页，验证登录成功
  await page.goto('/');

  // 验证头像和用户信息在导航栏中显示
  await expect(page.getByText('GitHub 测试用户')).toBeVisible({ timeout: 5000 });

  // 保存登录状态
  await page.context().storageState({ path: 'playwright/.auth/github-user.json' });
});

/**
 * 模拟Google OAuth流程的登录状态
 */
setup('模拟Google OAuth登录', async ({ page }) => {
  // 1. 访问登录页面
  await page.goto('/login');
  await expect(page).toHaveTitle(/登录/);

  // 2. 点击"使用Google登录"按钮
  const googleButton = page.getByText('继续使用 Google 登录');
  await expect(googleButton).toBeVisible();

  // 3. 我们不能直接点击Google按钮，因为它会重定向到实际的Google
  // 相反我们直接模拟OAuth回调过程

  // 创建模拟的OAuth回调数据
  const mockUser = {
    id: 'g_123456',
    username: 'google_test_user',
    email: 'google_test@example.com',
    providerId: 'g_123456',
    provider: 'google',
    photo: 'https://lh3.googleusercontent.com/mock/photo.jpg',
    displayName: 'Google 测试用户'
  };

  // 模拟OAuth回调 - 直接设置localStorage
  await page.evaluate((userData) => {
    const token = 'mock_google_token_xyz';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }, mockUser);

  // 重定向到主页，验证登录成功
  await page.goto('/');

  // 验证头像和用户信息在导航栏中显示
  await expect(page.getByText('Google 测试用户')).toBeVisible({ timeout: 5000 });

  // 保存登录状态
  await page.context().storageState({ path: 'playwright/.auth/google-user.json' });
});
