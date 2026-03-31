import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
