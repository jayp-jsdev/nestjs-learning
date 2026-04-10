import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.Strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
    JwtModule.register({
      secret: '',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
})
export class AuthModule {}
