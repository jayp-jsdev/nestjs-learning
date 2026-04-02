import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entity/order.entity';

export enum Roles {
  Admin = 'Admin',
  User = 'User',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  role!: Roles;

  @OneToMany(() => Order, (order) => order.user)
  order!: Order[];
}
