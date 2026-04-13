import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

interface product {
  productId: string;
  quantity: number;
}

export class OrderDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one product' })
  products!: product[];
}
