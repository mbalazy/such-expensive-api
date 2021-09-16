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

@Entity()
@ObjectType()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column({ nullable: true })
  @Field()
  lastName: string;

  @Column("text", { unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.user, { nullable: true })
  @Field(() => [Product], { nullable: true })
  products: Product[];

  @OneToMany(() => Product, (product) => product.user, { nullable: true })
  @Field(() => [Product], { nullable: true })
  wishlist: Product[];

  @OneToMany(() => Product, (product) => product.user, { nullable: true })
  @Field(() => [Product], { nullable: true })
  cart: Product[];

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
