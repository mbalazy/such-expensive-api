import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import CartItem from "../entity/CartItem";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getCartData } from "../utils/getCartData";
import Cart from "../entity/Cart";

@Resolver()
export class CartResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    let { cart, product, cartItem } =
      (await getCartData(productId, req.session.userId)) || {};

    if (!cartItem) {
      cartItem = await CartItem.create({
        cart,
        product,
        quantity: 1,
      }).save();
    } else {
      cartItem.quantity++;
      await cartItem.save();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeFromCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { cartItem } =
      (await getCartData(productId, req.session.userId)) || {};

    if (!cartItem) {
      return false;
    } else if (cartItem.quantity >= 2) {
      cartItem.quantity--;
      cartItem.save();
    } else {
      cartItem.remove();
    }


    return true;
  }

  @Query(() => Cart, { nullable: true })
  @UseMiddleware(isAuth)
  async getCart(@Ctx() { req }: MyContext): Promise<Cart | undefined> {
    const { cart } = (await getCartData(undefined, req.session.userId)) || {};
    console.log('getCart')
    console.log(cart);
    return cart;
  }
}
