import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderItem } from './entity/order-item.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    ProductModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
})
export class OrderModule {}
