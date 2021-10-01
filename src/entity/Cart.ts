import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import User from "./User";
import CartItem from "./CartItem";

@Entity()
@ObjectType()
class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Field(() => [CartItem], { defaultValue: [] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
  cartItems: CartItem[];

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  user: User;
}

export default Cart;
