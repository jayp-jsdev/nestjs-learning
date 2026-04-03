import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entity/order.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  price!: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  category!: string;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  rating!: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  image!: string;
}
