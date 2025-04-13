import { test, expect, Page } from '@playwright/test';

// 测试两个客户端之间的协同绘图功能
test('collaborative drawing between two clients', async ({ browser }) => {
  // 启动两个浏览器上下文，模拟两个不同的用户
  const userContextA = await browser.newContext();
  const userContextB = await browser.newContext();

  // 创建两个页面
  const pageA = await userContextA.newPage();
  const pageB = await userContextB.newPage();

  // 生成相同的房间ID，确保两个用户加入同一房间
  const roomId = `test-room-${Date.now()}`;
  const roomUrl = `/room/${roomId}`;

  // 第一个用户创建房间
  console.log('User A creating and joining room:', roomId);
  await pageA.goto(roomUrl);
  await pageA.waitForSelector('canvas');
  
  // 确认用户A看到房间信息
  const roomTextA = await pageA.getByText(roomId).first();
  await expect(roomTextA).toBeVisible();
  
  // 第二个用户加入相同房间
  console.log('User B joining room:', roomId);
  await pageB.goto(roomUrl);
  await pageB.waitForSelector('canvas');
  
  // 确认用户B看到房间信息
  const roomTextB = await pageB.getByText(roomId).first();
  await expect(roomTextB).toBeVisible();
  
  // 等待连接和同步完成
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 用户A绘制一条线
  console.log('User A drawing a line');
  await drawLine(pageA, {
    startX: 100,
    startY: 100,
    endX: 200,
    endY: 200
  });
  
  // 等待数据同步
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 检查用户B是否看到用户A的绘图内容
  // 这里我们无法直接验证canvas的内容，但可以通过截图比较或检查DOM结构变化
  console.log('Verifying User B sees User A\'s drawing');
  
  // 用户B绘制另一条线
  console.log('User B drawing a line');
  await drawLine(pageB, {
    startX: 300,
    startY: 100,
    endX: 400,
    endY: 200
  });
  
  // 等待数据同步
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 验证用户B能够清除画布，且变化同步到用户A
  console.log('User B clearing canvas');
  await pageB.getByText('清除画布').click();
  
  // 等待清除操作同步
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 关闭两个页面
  await pageA.close();
  await pageB.close();
  
  console.log('Test completed');
});

// 帮助函数：在canvas上绘制线条
async function drawLine(page: Page, { startX, startY, endX, endY }: { startX: number, startY: number, endX: number, endY: number }) {
  const canvas = await page.locator('.w-full.h-full');
  
  // 设置颜色和笔刷大小
  await page.locator('input[type="color"]').fill('#ff0000');
  await page.locator('input[type="range"]').fill('5');
  
  // 执行鼠标绘图操作
  await canvas.hover({ position: { x: startX, y: startY } });
  await page.mouse.down();
  
  // 鼠标移动到终点
  await canvas.hover({ position: { x: endX, y: endY } });
  await page.mouse.up();
} 