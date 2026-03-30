import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProductModule } from '../product/product.module';

const config = {
  apiKey: 'User_130932',
};

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'CONFIG',
      useValue: config,
    },
  ],
  imports: [forwardRef(() => ProductModule)],
  exports: [UserService],
})
export class UserModule {}
