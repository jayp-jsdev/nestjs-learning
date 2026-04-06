import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class OrderDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one product' })
  @IsUUID('all', { each: true, message: 'Each productId must be a valid UUID' })
  productIds!: string[];
}
