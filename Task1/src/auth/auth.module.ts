import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
