import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Product from "./Product";
import CartItem from "./CartItem";

@Entity()
@ObjectType()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column("text", { unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.user, { nullable: true })
  @Field(() => [Product], { nullable: true })
  products: Product[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user, { eager: true })
  @Field(() => [CartItem], { nullable: true })
  cartItems: CartItem[];

  @Column("text", { nullable: true })
  @Field()
  adress: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

export default User;
