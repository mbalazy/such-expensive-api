import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Column,
} from "typeorm";
import Cart from "./Cart";
import User from "./User";

@Entity()
class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cartId: number;

  @OneToOne(() => Cart)
  cart: Cart;

  @ManyToOne(() => User, { cascade: true })
  user: User;
}

export default Order;
