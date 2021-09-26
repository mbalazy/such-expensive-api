import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import User from "./User";

@Entity()
@ObjectType()
class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  userId: number;

  @Column({ type: "int" })
  @Field(() => Int)
  total: number;

  @OneToOne(() => User, { cascade: true })
  user: User;
}

export default Cart;
