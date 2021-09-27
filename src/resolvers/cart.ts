import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { CartResponse } from "../utils/inputsAndFields";
import Cart from "../entity/Cart";
import { updateCartTotal } from "../utils/updateCartTotal";

@Resolver()
export class CartResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    //TODO not dry -> same in whole resolver
    const product = await Product.findOne(productId);
    if (!product) return false;

    const userId = req.session.userId;

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId }).save();
    }

    const cartItem = await CartItem.findOne({
      where: { cart, product },
      relations: ["product"],
    });

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
    const product = await Product.findOne(productId);
    if (!product) return false;

    const userId = req.session.userId;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return false;

    const cartItem = await CartItem.findOne({
      where: { cart, product },
      relations: ["product"],
    });

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
    const cart = await Cart.findOne({ where: { userId: req.session.userId } });
    const cartItems = await CartItem.find({
      where: { cart },
      relations: ["product"],
    });

    const total = await updateCartTotal(cart);

    return {
      cartItems,
      total,
    };
  }
}
