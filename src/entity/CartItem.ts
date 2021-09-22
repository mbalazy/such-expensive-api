import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Product from "./Product";
import User from "./User";

@Entity()
@ObjectType()
class CartItem extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  productId: number;

  @Column({ type: "int" })
  @Field()
  quantity: number;

  @ManyToOne(() => Product, { cascade: true })
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => User, { cascade: true })
  user: User;
}

export default CartItem;
