import { Field, ID } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import OrderItem from "./OrderItem";
import User from "./User";

@Entity()
class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
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
