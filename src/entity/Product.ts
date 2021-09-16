import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";

@Entity()
@ObjectType()
class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column("text")
  @Field()
  description: string;

  @Column("numeric")
  @Field()
  price: number;

  @ManyToOne(() => User, (user) => user.products)
  @Field(() => User)
  user: User;

  @Column("numeric", { default: 0 })
  @Field()
  wishlistedCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

export default Product;
