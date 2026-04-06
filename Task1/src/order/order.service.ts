import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { OrderItem } from './entity/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
    private dataSource: DataSource,
    private usersService: UserService,
  ) {}

  async createOrder(body) {
    try {
      const user = await this.usersService.getUserById(body.userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const products = await this.productService.findByIds(
        body.products.map((item) => item.productId),
      );

      const checkStock = products.find((item) => item.stock <= 0);
      if (checkStock) {
        throw new BadRequestException({
          checkStock,
          message: 'Product OutofStock',
        });
      }

      if (products.length !== body.products.length) {
        const foundIds = products.map((p) => p.id);
        const missing = body.products
          .map((item) => item.productId)
          .filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Products not found: ${missing.join(', ')}`,
        );
      }

      const totalAmount = products
        .map((item) => {
          const findQuantity = body.products.find(
            (product) => product.productId === item.id,
          );

          if (findQuantity) {
            return +findQuantity.quantity * +item.price;
          }
          return item.price;
        })
        .reduce((sum, product) => sum + Number(product));

      const orderData = await this.dataSource.transaction(async (manager) => {
        const order = manager.create(Order);
        order.user = user;
        order.userId = user.id;
        order.products = products;
        order.totalAmount = totalAmount;
        const finalOrder = await manager.save(Order, order);

        const orderItem = body.products.map((item) => {
          return manager.create(OrderItem, {
            order: finalOrder,
            productId: item.productId,
            quantity: item.quantity,
          });
        });

        const saveOrderItem = await manager.save(OrderItem, orderItem);

        return order;
      });

      return orderData;
    } catch (error) {
      throw new HttpException(
        'Order creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrder() {
    return await this.orderRepository.find({
      relations: ['products', 'orderItems'],
    });
  }
}
