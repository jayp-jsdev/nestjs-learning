import { IsNotEmpty, IsString } from 'class-validator';

export class OrderItemDTO {
  @IsNotEmpty({ message: 'OrderId Must required' })
  @IsString()
  orderId!: string;

  @IsNotEmpty({ message: 'ProductId Must required' })
  @IsString()
  productId!: string;

  @IsNotEmpty({ message: 'quantity Must required' })
  @IsString()
  quantity!: number;
}
