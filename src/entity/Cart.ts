import {
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType } from "type-graphql";
import User from "./User";

@Entity()
@ObjectType()
class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: "int", default: 0 })
  total: number;

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  user: User;
}

export default Cart;
