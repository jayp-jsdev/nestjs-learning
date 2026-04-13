import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order-dto';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: OrderDTO) {
    return await this.orderService.createOrder(body);
  }

  @Get()
  async getOrder() {
    return await this.orderService.getOrder();
  }
}
