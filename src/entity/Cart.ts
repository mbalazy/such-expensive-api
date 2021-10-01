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

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems?: CartItem[];

  @Field()
  @Column({ type: "int", default: 0 })
  total: number;

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  user: User;
}

export default Cart;
