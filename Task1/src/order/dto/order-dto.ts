import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDTO {
  @IsNotEmpty({ message: 'Please enter Quantity' })
  @IsNumber()
  quantity!: number;

  @IsNotEmpty({ message: 'ProductID Must need' })
  @IsString()
  productId!: string;

  @IsNotEmpty({ message: 'UserID Must need' })
  @IsString()
  userId!: string;
}
