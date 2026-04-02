import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async createOrder(body) {
    const { quantity, productId, userId } = body;

    try {
      const findProduct = await this.orderRepository.findBy({
        productId,
      });

      if (findProduct && findProduct?.length > 0) {
        const totalQuantity = findProduct[0].quantity + quantity;
        return await this.orderRepository.update(
          { productId },
          { quantity: totalQuantity },
        );
      }

      return await this.orderRepository.save(body);
    } catch (error) {
      throw new HttpException(
        'Order creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrder() {
    return await this.orderRepository.find({
      relations: {
        // user: true,
        product: true,
      },
    });
  }
}
