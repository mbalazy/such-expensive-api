import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";
import Order from "./Order";
import Product from "./Product";

@Entity()
@ObjectType()
class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Product)
  @Field()
  product: Product;

  @Field()
  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
  order: Order;

  @Column("text", { nullable: true })
  @Field(() => String, { nullable: true })
  sellerAdres?: User["adress"];

  @Column("text", { nullable: true })
  @Field(() => String, { nullable: true })
  sellerPhone?: User["phone"];
}

export default OrderItem;
