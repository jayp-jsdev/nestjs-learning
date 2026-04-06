import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDTO {
  @IsString()
  id!: string;

  @IsNotEmpty({ message: 'Please Enter Prodcut Name' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Please Enter Price' })
  @IsNumber()
  price!: number;

  @IsNotEmpty({ message: 'Please enter category' })
  @IsString()
  category!: string;

  @IsNotEmpty({ message: 'Add Rating' })
  @IsNumber()
  rating!: number;

  @IsNotEmpty({ message: 'Please add stock' })
  @IsNumber()
  stock!: number;

  @IsNotEmpty({ message: 'Please Add Image' })
  @IsString()
  image!: string;
}
