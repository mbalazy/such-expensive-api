import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import Cart from "../entity/Cart";
import { OrderResponse } from "../utils/inputsAndFields";

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

      const products = cart.cartItems.map((item) => item.product);
      const quantities = cart.cartItems.map((item) => item.quantity);

      const orderedItems: OrderResponse["orderedItems"] = products.map(
        (product, i) => {
          return {
            product,
            quantity: quantities[i],
            sellerAdres: product.user.adress,
            sellerPhone: product.user.phone,
          };
        }
      );
      return {
        orderedItems,
      };
    } catch (err) {
      return {
        errors: [{ field: "cart", message: "this cart dont exist" }],
      };
    }
  }
}
