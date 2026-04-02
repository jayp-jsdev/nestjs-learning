import { Expose } from 'class-transformer';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entity/user.entity';

export class OrderResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  quantity!: number;

  @Expose()
  productId!: string;

  @Expose()
  userId!: string;

  @Expose()
  user?: User;

  @Expose()
  product?: Product;
}
