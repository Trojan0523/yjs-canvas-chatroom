import { resolve } from 'path';
import fs from 'fs';

/**
 * 全局设置函数
 * 用于在测试开始前创建必要的目录结构
 */
async function globalSetup() {
  // 创建保存认证状态的目录
  const authDir = resolve(process.cwd(), 'playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 可以在这里添加任何全局设置
  console.log('全局设置完成，测试环境已准备就绪');
}

export default globalSetup;
