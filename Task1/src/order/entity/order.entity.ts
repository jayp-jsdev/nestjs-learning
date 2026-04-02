import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entity/user.entity';
import { ProductDTO } from '../../product/dto/product-dto';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity!: number;

  @Column({
    type: 'varchar',
  })
  productId!: string;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn()
  user!: User;

  @Column({ nullable: true })
  userId!: string;

  @ManyToMany(() => Product)
  @JoinTable()
  product!: ProductDTO[];
}
