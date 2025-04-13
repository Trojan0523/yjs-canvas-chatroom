/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:45:51
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 20:10:09
 * @Description: 请填写简介
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Get the Express instance from the NestJS app
  const expressApp = app.getHttpAdapter().getInstance();

  // Path to client-dist directory
  const clientDistPath = path.join(__dirname, '..', 'client-dist');

  // Serve static files from client-dist directory
  expressApp.use(express.static(clientDistPath));

  // For API and WebSocket routes, let NestJS handle them
  // For all other routes, serve index.html for client-side routing
  expressApp.use((req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/socket.io')) {
      return next();
    }

    // For all other routes, serve index.html
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
