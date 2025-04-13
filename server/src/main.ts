/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:45:51
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 20:10:09
 * @Description: 请填写简介
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    
    // 添加全局验证管道
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 过滤掉未在DTO中定义的属性
        forbidNonWhitelisted: true, // 当请求包含未在DTO中定义的属性时，抛出错误
        transform: true, // 自动转换类型
      }),
    );
    
    // API前缀 - 将所有API路由移到/api路径下
    app.setGlobalPrefix('api');
    
    // 获取Express实例
    const expressApp = app.getHttpAdapter().getInstance();
    
    // 提供静态文件
    const clientPath = path.join(__dirname, '../../client/dist');
    expressApp.use(express.static(clientPath));
    
    // 处理前端路由
    expressApp.use((req, res, next) => {
      // 跳过API和WebSocket请求
      if (req.url.startsWith('/api') || req.url.startsWith('/socket.io')) {
        return next();
      }
      
      // 给前端的React路由
      res.sendFile(path.join(clientPath, 'index.html'), err => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).send('Error loading application');
        }
      });
    });
    
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
