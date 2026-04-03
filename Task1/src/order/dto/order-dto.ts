import { IsNotEmpty, IsString } from 'class-validator';
import { OrderItemDTO } from './order-items-dto';

export class OrderDTO {
  @IsNotEmpty({ message: 'UserID Must need' })
  @IsString()
  userId!: string;

  items!: OrderItemDTO[];
}
