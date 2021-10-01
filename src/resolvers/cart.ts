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
  @Mutation(() => Cart, { nullable: true })
  @UseMiddleware(isAuth)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<Cart | undefined> {
    let { cart, product, cartItem } = await getCartData(
      productId,
      req.session.userId
    );

    if (!cartItem && product) {
      cartItem = await CartItem.create({
        cartId: cart.id,
        product,
        quantity: 1,
      }).save();
      cart.cartItems.unshift(cartItem);
    } else if (cartItem) {
      cartItem.quantity++;
      await cartItem.save();
    } else {
      return cart;
    }

    return cart;
  }

  @Mutation(() => Cart)
  @UseMiddleware(isAuth)
  async removeFromCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<Cart | undefined> {
    let { cartItem, cart } = await getCartData(productId, req.session.userId);

    if (!cartItem) {
      return cart;
    } else if (cartItem.quantity >= 2) {
      cartItem.quantity--;
      cartItem.save();
    } else {
      cartItem.remove();
      cart.cartItems = cart.cartItems.filter(
        (item) => item.productId !== cartItem?.productId
      );
    }

    return cart;
  }

  @Query(() => Cart, { nullable: true })
  @UseMiddleware(isAuth)
  async getCart(@Ctx() { req }: MyContext): Promise<Cart | undefined> {
    const { cart } = await getCartData(undefined, req.session.userId);
    return cart;
  }
}
