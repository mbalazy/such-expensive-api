import { Resolver, Mutation, Ctx, UseMiddleware, Query } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import Cart from "../entity/Cart";
import Order from "../entity/Order";

@Resolver()
export class OrderResolver {
  @Mutation(() => Order)
  @UseMiddleware(isAuth)
  async createOrder(@Ctx() { req }: MyContext): Promise<Order> {
    const userId = req.session.userId;
    const cart = await Cart.findOneOrFail({ where: { userId } });

    const orderItems = cart.cartItems.map(({ product, quantity }) => ({
      product,
      quantity,
      sellerAdres: product.user.adress,
      sellerPhone: product.user.phone,
    }));

    const order = await Order.create({ userId, orderItems }).save();

    return order;
  }

  @Query(() => [Order])
  @UseMiddleware(isAuth)
  async getAllOrders(@Ctx() { req }: MyContext): Promise<Order[]> {
    const userId = req.session.userId;
    console.log(userId);
    const orders = await Order.find({
      where: { userId },
      // relations: ['orderItems', 'orderItems.product']
      join: {
        alias: "order",
        leftJoinAndSelect: {
          orderItems: "order.orderItems",
          product: "orderItems.product",
        },
      },
    });
    console.log(orders);
    return orders;
  }
}
