import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import Product from "./Product";
import Cart from "./Cart";

@Entity()
@ObjectType()
class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @PrimaryColumn()
  cartId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Cart, { cascade: true, onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => Product, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @Field(() => Product)
  product: Product;

  @Column({ type: "int" })
  @Field(() => Int)
  quantity: number;
}

export default CartItem;
