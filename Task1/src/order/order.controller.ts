import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order-dto';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: OrderDTO) {
    return await this.orderService.createOrder(body);
  }

  @Get(':id')
  async getOrder(@Param('userId') userId: string) {
    return await this.orderService.getOrder(userId);
  }
}
