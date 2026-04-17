import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../config/redis-config';

@Module({
  providers: [ProductService, RedisService],
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductModule {}
