/*
 * @Author: BuXiongYu
 * @Date: 2025-04-13 11:52:47
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-13 16:57:07
 * @Description: 请填写简介
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // 检查服务器是否可用
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'OPTIONS'
      });
      if (response.status === 404) {
        throw new Error('Server is not available');
      }
    } catch (error) {
      console.error('Server availability check failed:', error);
      throw new Error('Please ensure the server is running on port 3000');
    }

    // 访问注册页面
    await page.goto('http://localhost:5173/register');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('should show success toast after successful registration', async ({ page }) => {
    // 生成随机用户名和邮箱，避免重复注册
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;

    // 填写注册表单
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    // 提交表单
    await page.click('button[type="submit"]');

    // 等待网络请求完成
    const response = await page.waitForResponse(response =>
      response.url().includes('/api/auth/register') &&
      response.status() === 201
    );

    // 打印响应内容
    console.log('Registration response:', await response.json());

    // 等待 toast 出现
    const toast = page.locator('[data-testid="toast"]');
    await expect(toast).toBeVisible({ timeout: 10000 });

    // 验证 toast 内容
    await expect(toast).toContainText('注册成功！即将跳转到登录页面...');

    // 验证 toast 样式
    await expect(toast.locator('div')).toHaveClass(/bg-green-500/);

    // 等待跳转到登录页面
    await page.waitForURL('**/login', { timeout: 10000 });
  });

  test('should show error message for invalid registration', async ({ page }) => {
    // 填写无效的注册表单
    await page.fill('input[name="username"]', 'te'); // 用户名太短
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123'); // 密码太短
    await page.fill('input[name="confirmPassword"]', '456'); // 密码不匹配

    // 提交表单
    await page.click('button[type="submit"]');

    // 等待错误消息出现
    await page.waitForSelector('.text-red-500', { state: 'visible', timeout: 10000 });

    // 获取所有错误消息
    const errorMessages = await page.locator('.text-red-500').allTextContents();
    console.log('Error messages:', errorMessages);

    // 验证错误消息
    expect(errorMessages).toContain('用户名长度不能少于3个字符');
    expect(errorMessages).toContain('请输入有效的邮箱地址');
    expect(errorMessages).toContain('密码长度不能少于6个字符');
    expect(errorMessages).toContain('两次输入的密码不一致');
  });
});
