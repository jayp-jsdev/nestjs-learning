import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { orderProduct } from '../Types/types';

export class OrderDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one product' })
  products!: orderProduct[];
}
