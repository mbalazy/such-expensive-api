import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import Cart from "../entity/Cart";
import { OrderResponse } from "../utils/inputsAndFields";
import Order from "../entity/Order";

@Resolver()
export class OrderResolver {
  @Mutation(() => OrderResponse)
  @UseMiddleware(isAuth)
  async createOrder(
    @Arg("cartId") cartId: number,
    @Ctx() { req }: MyContext
  ): Promise<OrderResponse> {
    try {
      const userId = req.session.userId;
      const cart = await Cart.findOneOrFail({ where: { id: cartId, userId } });
      await Order.create({ cartId: cart.id, userId }).save();

      return {
        orderDetails: cart.cartItems.map(({ product, quantity }) => ({
          product,
          quantity,
          sellerAdres: product.user.adress,
          sellerPhone: product.user.phone,
        })),
      };
    } catch (err) {
      console.error(err);
      return {
        errors: [{ field: "cart", message: "This cart does not exist" }],
      };
    }
  }
}
