import { Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import Cart from "./Cart";
import OrderItem from "./OrderItem";
import User from "./User";

@Entity()
class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  cartId: number;

  @OneToOne(() => Cart)
  cart: Cart;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Column()
  userId: number;

  @ManyToOne(() => User, { cascade: true })
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;
}

export default Order;
