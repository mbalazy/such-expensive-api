import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import Product from "./Product";
import Cart from "./Cart";

@Entity()
@ObjectType()
class CartItem extends BaseEntity {
  @PrimaryColumn()
  cartId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Cart, { cascade: true, onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => Product, {
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
