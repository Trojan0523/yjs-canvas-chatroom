import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
      customHeaders: {
        'User-Agent': 'simple-crdt-chatroom-canvas',
      },
      timeout: 10000,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      this.logger.log(`GitHub授权成功，用户: ${profile.username}`);

      const { id, username, emails, photos } = profile;
      const email = emails && emails.length > 0 ? emails[0].value : null;
      const photo = photos && photos.length > 0 ? photos[0].value : null;

      return this.authService.validateOAuthUser({
        providerId: id,
        provider: 'github',
        email,
        username: username || email,
        displayName: profile.displayName,
        photo,
      });
    } catch (error) {
      this.logger.error(`GitHub授权验证失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
