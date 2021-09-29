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

  @Column()
  userId: number;

  @ManyToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

export default Product;
