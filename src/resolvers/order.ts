import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import Cart from "../entity/Cart";

@Resolver()
export class OrderResolver {
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async createOrder(
    @Arg("cartId") cartId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const userId = req.session.userId;
    const cart = await Cart.findOne({ where: { id: cartId, userId } });
    console.log(cart);
    return true;
  }
}
