import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Product from "./Product";
import User from "./User";

@Entity()
@ObjectType()
class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  cartItemId: number;

  @Column({ type: "int" })
  @Field()
  quantity: number;

  @ManyToOne(() => Product, { cascade: true })
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => User, (user) => user.cartItems)
  @Field(() => User)
  user: User;
}

export default CartItem;
