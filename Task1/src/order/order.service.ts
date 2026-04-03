import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entity/order-items.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    private dataSource: DataSource,
  ) {}

  async createOrder(body) {
    const { userId, items } = body;

    try {
      const order = await this.dataSource.transaction(async (manger) => {
        const createdOrder = await manger.save(Order, {
          user: userId,
        });

        const orderItems = items.map((item) => {
          return manger.create(OrderItem, {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
          });
        });

        await manger.save(OrderItem, orderItems);

        return createdOrder;
      });

      return this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['items', 'items.product'],
      });
    } catch (error) {
      throw new HttpException(
        'Order creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrder() {
    return await this.orderRepository.find({
      relations: ['products'],
    });
  }
}
