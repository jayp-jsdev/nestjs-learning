import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [forwardRef(() => UserModule)],
  exports: [ProductService],
})
export class ProductModule {}
