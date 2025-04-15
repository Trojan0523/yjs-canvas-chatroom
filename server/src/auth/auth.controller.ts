/*
 * @Author: BuXiongYu
 * @Date: 2025-04-12 13:48:34
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-12 17:26:02
 * @Description: 请填写简介
 */
import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

// 扩展Request类型以包含user属性
interface RequestWithUser extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    // 排除password后返回
    const { password, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    // 获取当前用户
    const userId = req.user.id;

    // 在实际应用中，你可能需要:
    // 1. 添加token到黑名单
    // 2. 清除服务器端的会话状态
    // 3. 记录退出登录日志

    return {
      message: '退出登录成功',
      userId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  // GitHub OAuth认证路由
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // 初始化GitHub认证，这里不需要实现任何代码
    // Passport会处理重定向
  }

  // GitHub OAuth回调路由
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    // 使用oauthLogin方法生成JWT token
    this.authService.oauthLogin(req.user).then(authResult => {
      // 重定向到前端，并附带token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const url = new URL(`${frontendUrl}/oauth-callback`);
      url.searchParams.append('token', authResult.access_token);
      url.searchParams.append('user', JSON.stringify(authResult.user));
      res.redirect(url.toString());
    });
  }

  // Google OAuth认证路由
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // 初始化Google认证，这里不需要实现任何代码
    // Passport会处理重定向
  }

  // Google OAuth回调路由
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    // 使用oauthLogin方法生成JWT token
    this.authService.oauthLogin(req.user).then(authResult => {
      // 重定向到前端，并附带token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const url = new URL(`${frontendUrl}/oauth-callback`);
      url.searchParams.append('token', authResult.access_token);
      url.searchParams.append('user', JSON.stringify(authResult.user));
      res.redirect(url.toString());
    });
  }
}
