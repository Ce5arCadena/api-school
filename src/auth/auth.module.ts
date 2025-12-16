import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {expiresIn: '3h'}
    })
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
