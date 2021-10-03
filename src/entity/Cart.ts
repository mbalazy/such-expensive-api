import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";
import CartItem from "./CartItem";

@Entity()
@ObjectType()
class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Field(() => [CartItem], { defaultValue: [] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
  cartItems: CartItem[];
}

export default Cart;
