import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * OAuth错误处理中间件
 * 处理第三方OAuth认证中的常见错误
 */
@Injectable()
export class OAuthErrorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OAuthErrorMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const originalUrl = req.originalUrl;

    // 只处理OAuth相关路由
    if (originalUrl.includes('/auth/github') || originalUrl.includes('/auth/google')) {
      try {
        // 捕获请求过程中的错误
        const originalEnd = res.end;
        res.end = function(...args: any[]) {
          if (res.statusCode >= 400) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

            // 日志记录错误
            this.logger.error(`OAuth认证失败: ${res.statusCode} - ${originalUrl}`);

            // 提取服务提供商名称
            let provider = 'oauth';
            if (originalUrl.includes('/github')) provider = 'github';
            if (originalUrl.includes('/google')) provider = 'google';

            // 重定向到前端错误页面
            return res.redirect(`${frontendUrl}/login?error=true&provider=${provider}`);
          }
          return originalEnd.apply(res, args);
        };
      } catch (error) {
        this.logger.error(`处理OAuth路由时发生错误: ${error.message}`, error.stack);
      }
    }
    next();
  }
}
