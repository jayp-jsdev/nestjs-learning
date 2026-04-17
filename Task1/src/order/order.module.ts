import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderItem } from './entity/order-item.entity';
import { EmailWorker } from '../common/workers/email-worker';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [OrderController],
  providers: [OrderService, EmailWorker],
  imports: [
    ProductModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    BullModule.registerQueue({ name: 'email-queue' }),
  ],
})
export class OrderModule {}
