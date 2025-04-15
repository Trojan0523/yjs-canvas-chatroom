import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { OAuthUserData } from './dto/oauth-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);
      const isPasswordValid = await user.validatePassword(password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async validateOAuthUser(oauthData: OAuthUserData): Promise<any> {
    // 查找是否有已关联的用户
    let user = await this.usersService.findByProviderId(
      oauthData.providerId,
      oauthData.provider
    );

    // 如果没找到用户但有邮箱，尝试通过邮箱查找
    if (!user && oauthData.email) {
      try {
        user = await this.usersService.findByEmail(oauthData.email);

        // 找到用户但未关联，则更新关联信息
        if (user) {
          user.providerId = oauthData.providerId;
          user.provider = oauthData.provider;
          user.photo = oauthData.photo || user.photo;
          user.displayName = oauthData.displayName || user.displayName;
          await this.usersService.update(user.id, user);
        }
      } catch (error) {
        // 找不到用户，继续下一步创建新用户
      }
    }

    // 如果仍未找到用户，创建新用户
    if (!user) {
      const password = this.generateRandomPassword();
      const createUserDto: CreateUserDto = {
        username: oauthData.username,
        email: oauthData.email,
        password,
        providerId: oauthData.providerId,
        provider: oauthData.provider,
        photo: oauthData.photo,
        displayName: oauthData.displayName,
      };

      user = await this.usersService.create(createUserDto);
    }

    const { password, ...result } = user;
    return result;
  }

  // 生成随机密码
  private generateRandomPassword(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('用户未注册');
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async oauthLogin(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        photo: user.photo,
        displayName: user.displayName,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
