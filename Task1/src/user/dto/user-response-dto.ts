import { Exclude, Expose, Type } from 'class-transformer';
import { OrderResponseDTO } from '../../order/dto/order-response.dto';

export class UserResponseDTO {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  @Type(() => OrderResponseDTO)
  order!: OrderResponseDTO[];

  @Exclude()
  role!: string;

  @Exclude()
  password!: string;
}
