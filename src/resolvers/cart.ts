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
import { CartResponse } from "../utils/inputsAndFields";
import { updateCartTotal } from "../utils/updateCartTotal";
import { getCartData } from "../utils/getCartData";

@Resolver()
export class CartResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { cart, product, cartItem } =
      (await getCartData(productId, req.session.userId)) || {};

    if (!cartItem) {
      await CartItem.create({
        cart,
        product,
        quantity: 1,
      }).save();
    } else {
      cartItem.quantity++;
      await cartItem.save();
    }

    await updateCartTotal(cart);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeFromCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { cart, cartItem } =
      (await getCartData(productId, req.session.userId)) || {};

    if (!cartItem) {
      return false;
    } else if (cartItem.quantity >= 2) {
      cartItem.quantity--;
      cartItem.save();
    } else {
      cartItem.remove();
    }

    await updateCartTotal(cart);

    return true;
  }

  @Query(() => CartResponse)
  @UseMiddleware(isAuth)
  async getCart(@Ctx() { req }: MyContext): Promise<CartResponse> {
    const { cart, cartItems } =
      (await getCartData(undefined, req.session.userId)) || {};
    const total = await updateCartTotal(cart);
    return {
      cartItems,
      total,
    };
  }
}
