import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.Strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from './config/jwt-config';
import { ConfigModule } from '@nestjs/config';
import jwtRefreshTokenConfig from './config/refresh-config';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshTokenConfig),
  ],
})
export class AuthModule {}
