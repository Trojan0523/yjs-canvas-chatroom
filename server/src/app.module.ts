import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvasGateway } from './canvas.gateway';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { SharedModule } from './shared/shared.module';
import { OAuthErrorMiddleware } from './auth/middlewares/oauth-error.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, CanvasGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OAuthErrorMiddleware)
      .forRoutes('api/auth/*');
  }
}
