import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";
import Order from "./Order";

@Entity()
@ObjectType()
class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Field()
  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order

  @Column('text', {nullable: true})
  @Field(() => String, { nullable: true })
  sellerAdres?: User["adress"];

  @Column('text', {nullable: true})
  @Field(() => String, { nullable: true })
  sellerPhone?: User["phone"];

  @Column("numeric")
  @Field()
  price: number;
}

export default OrderItem;
