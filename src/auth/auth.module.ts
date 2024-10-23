import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminAccountModule } from 'src/Admin Account/admin-account.module';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [AccountModule, AdminAccountModule, PassportModule, ConfigModule.forRoot(), JwtModule.register({
    privateKey: process.env.JWT_SECRET_KEY,
    signOptions: {expiresIn: "1h"},
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AccountService],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}
