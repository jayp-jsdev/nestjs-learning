import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: any) {
    return await this.orderService.createOrder(body);
  }

  @Get()
  async getOrder() {
    return await this.orderService.getOrder();
  }
}
