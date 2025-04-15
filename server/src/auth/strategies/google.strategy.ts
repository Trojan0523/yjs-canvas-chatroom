import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const photo = photos && photos.length > 0 ? photos[0].value : null;

    return this.authService.validateOAuthUser({
      providerId: id,
      provider: 'google',
      email,
      username: email,
      displayName,
      photo,
    });
  }
}
